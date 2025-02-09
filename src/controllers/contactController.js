import ContactService from "../services/contactService.js";

class ContactController {
  static async identify(req, res) {
    try {
      const { email, phoneNumber } = req.body;
      const contactService = new ContactService();
      const result = await contactService.identifyContact(email, phoneNumber);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ContactController;
