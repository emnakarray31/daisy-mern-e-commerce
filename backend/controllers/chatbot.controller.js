 
import Product from '../models/product.model.js';

const SYSTEM_PROMPT = `You are Daisy, an intelligent shopping assistant for "Daisy & More", a premium fashion e-commerce store.

**Your role:**
- Help customers find specific products
- Search products by category, name, price, or features
- Provide personalized recommendations
- Answer questions about orders, shipping, returns, and payments
- Handle customer support queries professionally

**Store information:**
- Categories: jeans, tshirts, shoes, glasses, jackets, suits, bags, accessories
- Free shipping across all Tunisia (3-7 business days via Aramex)
- 14-day return policy (unworn items with tags, sale items excluded)
- Payment: Credit/Debit cards via Stripe (secure)
- Special sales section with discounted items

**When to search products:**
- User asks to "find", "show", "search", "looking for", "recommend" products
- User mentions specific categories (jeans, shoes, bags, etc.)
- User asks about product availability
- User wants to see products by price range

**Examples:**
- "Show me jeans" → Call search_products with category: "jeans"
- "Find shoes under $50" → Call search_products with category: "shoes", maxPrice: 50
- "Looking for red bags" → Call search_products with category: "bags", color: "red"
- "What jackets do you have?" → Call search_products with category: "jackets"

**Tone:**
- Friendly, helpful, and professional
- Use emojis sparingly
- Keep responses concise when showing products
- Be enthusiastic about recommendations

**Important:**
- Always call search_products when user wants to see products
- If products found, mention how many and suggest viewing them
- If no products found, suggest browsing other categories
- Never make up product details or prices`; 
async function searchProducts({ category, search, minPrice, maxPrice, limit = 6 }) {
	try {
		const query = {}; 
		if (category) {
			const normalizedCategory = category.toLowerCase(); 
			const categoryMap = {
				'jean': 'jeans',
				'tshirt': 'tshirts',
				't-shirt': 'tshirts',
				'shoe': 'shoes',
				'glass': 'glasses',
				'sunglass': 'glasses',
				'sunglasses': 'glasses',
				'jacket': 'jackets',
				'coat': 'jackets',
				'suit': 'suits',
				'bag': 'bags',
				'accessory': 'accessories'
			};
			query.category = categoryMap[normalizedCategory] || normalizedCategory;
		} 
		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ description: { $regex: search, $options: 'i' } }
			];
		}
		 
		if (minPrice || maxPrice) {
			query.price = {};
			if (minPrice) query.price.$gte = Number(minPrice);
			if (maxPrice) query.price.$lte = Number(maxPrice);
		} 
		query.totalStock = { $gt: 0 };
		
		const products = await Product.find(query)
			.limit(Number(limit))
			.select('_id name price image category totalStock isFeatured discount')
			.lean();
		
		return {
			success: true,
			count: products.length,
			products: products.map(p => ({
				id: p._id.toString(),
				name: p.name,
				price: p.price,
				image: p.image,
				category: p.category,
				inStock: p.totalStock > 0,
				discount: p.discount || 0
			}))
		};
	} catch (error) {
		console.error('Product search error:', error);
		return {
			success: false,
			count: 0,
			products: []
		};
	}
}

export const chatbotMessage = async (req, res) => {
	try {
		const { message, conversationHistory = [] } = req.body;

		if (!message || message.trim() === '') {
			return res.status(400).json({ message: "Message is required" });
		}

		if (!process.env.GROQ_API_KEY) {
			console.error('GROQ_API_KEY not found in environment variables');
			return res.status(500).json({ 
				message: "Chatbot service is not configured properly" 
			});
		}
 
		const messages = [
			{
				role: "system",
				content: SYSTEM_PROMPT
			},
			...conversationHistory.slice(-10),
			{
				role: "user",
				content: message
			}
		]; 
		const tools = [
			{
				type: "function",
				function: {
					name: "search_products",
					description: "Search for products in the store database. Use this when user wants to find, see, or get recommendations for products.",
					parameters: {
						type: "object",
						properties: {
							category: {
								type: "string",
								enum: ["jeans", "tshirts", "shoes", "glasses", "jackets", "suits", "bags", "accessories"],
								description: "Product category to filter by"
							},
							search: {
								type: "string",
								description: "Search term for product name or description"
							},
							minPrice: {
								type: "number",
								description: "Minimum price filter"
							},
							maxPrice: {
								type: "number",
								description: "Maximum price filter"
							},
							limit: {
								type: "number",
								description: "Maximum number of products to return (default: 6)"
							}
						},
						required: []
					}
				}
			}
		];
 
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000);

		const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				messages: messages,
				model: "llama-3.3-70b-versatile",
				temperature: 0.7,
				max_tokens: 800,
				tools: tools,
				tool_choice: "auto"
			}),
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('Groq API error:', errorData);
			throw new Error(`API request failed with status ${response.status}`);
		}

		const data = await response.json();
		const assistantMessage = data.choices[0].message; 
		if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
			const toolCall = assistantMessage.tool_calls[0];
			const functionName = toolCall.function.name;
			const functionArgs = JSON.parse(toolCall.function.arguments);

			console.log('AI calling function:', functionName, 'with args:', functionArgs);
 
			if (functionName === 'search_products') {
				const searchResult = await searchProducts(functionArgs); 
				const secondMessages = [
					...messages,
					assistantMessage,
					{
						role: "tool",
						tool_call_id: toolCall.id,
						content: JSON.stringify(searchResult)
					}
				];

				const secondResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						messages: secondMessages,
						model: "llama-3.3-70b-versatile",
						temperature: 0.7,
						max_tokens: 500
					})
				});

				const secondData = await secondResponse.json();
				const finalResponse = secondData.choices[0].message.content;
 
				return res.status(200).json({
					success: true,
					message: finalResponse,
					products: searchResult.products,
					timestamp: new Date().toISOString()
				});
			}
		} 
		res.status(200).json({
			success: true,
			message: assistantMessage.content,
			products: null,
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Chatbot error:', error.message);
		
		if (error.name === 'AbortError') {
			return res.status(504).json({ 
				message: "Request timed out. Please try again." 
			});
		}

		res.status(500).json({ 
			message: "Sorry, I'm having trouble responding right now. Please try again." 
		});
	}
};

export const getSuggestedQuestions = (req, res) => {
	const suggestions = [
		"Show me jeans",
		"Find shoes under $50",
		"What jackets do you have?",
		"Looking for bags",
		"Show me accessories",
		"Do you have sunglasses?"
	];

	res.status(200).json({
		success: true,
		suggestions
	});
};