import Contact from '../models/contact.model.js';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD  
  }
});


export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

     if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all fields' 
      });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'new'
    });

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, 
        subject: `💬 New Contact Message - ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e53637; border-bottom: 3px solid #e53637; padding-bottom: 10px;">
              New Contact Message - Daisy & More
            </h2>
            
            <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #895129;">
              <p><strong>From:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: #fff; padding: 20px; border: 1px solid #eee;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="line-height: 1.6; color: #555;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #000; text-align: center;">
              <a href="${process.env.CLIENT_URL}/admin/messages" 
                 style="color: #fff; text-decoration: none; font-weight: bold; font-size: 16px;">
                📧 View in Admin Dashboard →
              </a>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
              Received on ${new Date().toLocaleString('en-US', { 
                dateStyle: 'long', 
                timeStyle: 'short' 
              })}
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent to admin');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
     }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: contact
    });

  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 });

    // Stats
    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' })
    };

    res.json({
      success: true,
      contacts,
      stats
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      contact
    });

  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const updateData = { status };
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    if (status === 'replied') {
      updateData.repliedAt = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      contact
    });

  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};