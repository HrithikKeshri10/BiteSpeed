import Contact from "../models/Contact.js";

class ContactService {
  async identifyContact(email, phoneNumber) {
    try {
      const existingContacts = await Contact.find({
        $or: [
          { email: { $in: [email, null].filter(Boolean) } },
          { phoneNumber: { $in: [phoneNumber, null].filter(Boolean) } },
        ],
        deletedAt: null,
      }).sort({ createdAt: 1 });

      if (existingContacts.length === 0) {
        const newContact = await Contact.create({
          email,
          phoneNumber,
          linkPrecedence: "primary",
          deletedAt: null,
        });
        return this.formatResponse(newContact);
      }

      const emailMatch = existingContacts.find((c) => c.email === email);
      const phoneMatch = existingContacts.find(
        (c) => c.phoneNumber === phoneNumber
      );

      if (
        emailMatch &&
        phoneMatch &&
        emailMatch._id !== phoneMatch._id &&
        emailMatch.linkPrecedence === "primary" &&
        phoneMatch.linkPrecedence === "primary"
      ) {
        const [primaryContact, secondaryContact] =
          emailMatch.createdAt < phoneMatch.createdAt
            ? [emailMatch, phoneMatch]
            : [phoneMatch, emailMatch];

        await Contact.findByIdAndUpdate(secondaryContact._id, {
          linkPrecedence: "secondary",
          linkedId: primaryContact._id,
        });

        const allRelatedContacts = await Contact.find({
          $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
          deletedAt: null,
        });

        return this.formatResponse(primaryContact, allRelatedContacts);
      }

      let primaryContact = existingContacts.find(
        (contact) => contact.linkPrecedence === "primary" && !contact.deletedAt
      );

      if (!primaryContact) {
        const secondaryContact = existingContacts.find(
          (contact) =>
            contact.linkPrecedence === "secondary" && !contact.deletedAt
        );
        if (secondaryContact && secondaryContact.linkedId) {
          primaryContact = await Contact.findOne({
            _id: secondaryContact.linkedId,
            deletedAt: null,
          });
        }
      }

      const exactMatchExists = existingContacts.some(
        (contact) =>
          contact.email === email &&
          contact.phoneNumber === phoneNumber &&
          !contact.deletedAt
      );

      if (!exactMatchExists && email && phoneNumber && primaryContact) {
        const hasMatchingInfo = existingContacts.some(
          (contact) =>
            (contact.email === email || contact.phoneNumber === phoneNumber) &&
            !contact.deletedAt
        );

        if (hasMatchingInfo) {
          const newSecondaryContact = await Contact.create({
            email,
            phoneNumber,
            linkedId: primaryContact._id,
            linkPrecedence: "secondary",
            deletedAt: null,
          });
          existingContacts.push(newSecondaryContact);
        }
      }

      const allRelatedContacts = await Contact.find({
        $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
        deletedAt: null,
      });

      return this.formatResponse(primaryContact, allRelatedContacts);
    } catch (error) {
      throw new Error(`Error in contact identification: ${error.message}`);
    }
  }

  formatResponse(primaryContact, allContacts = []) {
    const activeContacts = allContacts.filter((contact) => !contact.deletedAt);

    return {
      contact: {
        primaryContactId: primaryContact._id,
        emails: [
          ...new Set(activeContacts.map((c) => c.email).filter(Boolean)),
        ],
        phoneNumbers: [
          ...new Set(activeContacts.map((c) => c.phoneNumber).filter(Boolean)),
        ],
        secondaryContactIds: [
          ...new Set(
            activeContacts
              .filter((c) => c.linkPrecedence === "secondary" && !c.deletedAt)
              .map((c) => c._id)
          ),
        ],
      },
    };
  }
}

export default ContactService;
