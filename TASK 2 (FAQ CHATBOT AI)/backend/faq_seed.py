"""
Seed script to populate SQLite database with realistic sample FAQs
for Coursemate Academy (Online Learning Platform).
Includes 22 diverse questions across 5 core categories.
"""

from db import SessionLocal, init_db, FAQ

SAMPLE_FAQS = [
    # Category: Account & Security
    {
        "question": "How do I reset my password?",
        "answer": "Go to the login page, click 'Forgot password', enter your registered email address, and follow the password reset link sent directly to your inbox.",
        "category": "Account & Security",
    },
    {
        "question": "Can I change my registered email address?",
        "answer": "Yes. Navigate to 'Account Settings' -> 'Profile', enter your new email address, and verify it using the confirmation link sent to your new email.",
        "category": "Account & Security",
    },
    {
        "question": "How do I enable two-factor authentication (2FA)?",
        "answer": "Go to 'Account Settings' -> 'Security', click 'Enable 2FA', and scan the QR code using Google Authenticator, Authy, or any standard TOTP app.",
        "category": "Account & Security",
    },
    {
        "question": "How can I permanently delete my account?",
        "answer": "To delete your account and associated data, go to 'Account Settings' -> 'Privacy & Data' -> 'Delete Account'. Please note this action is irreversible and cancels active enrollments.",
        "category": "Account & Security",
    },

    # Category: Billing & Refunds
    {
        "question": "Can I get a refund for my course?",
        "answer": "Refunds are available within 30 days of purchase if you have completed less than 20% of the course content. Contact billing support with your order ID.",
        "category": "Billing & Refunds",
    },
    {
        "question": "What payment methods do you accept?",
        "answer": "We accept major credit/debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and UPI / Net Banking in supported regions.",
        "category": "Billing & Refunds",
    },
    {
        "question": "Where can I download my tax invoice or payment receipt?",
        "answer": "Visit your 'Purchase History' page under your profile avatar, locate the transaction, and click 'Download PDF Invoice'.",
        "category": "Billing & Refunds",
    },
    {
        "question": "Do you offer student or military discounts?",
        "answer": "Yes! We offer a 30% discount for verified students, educators, and military personnel through our Student Beans and SheerID verification portal.",
        "category": "Billing & Refunds",
    },

    # Category: Courses & Access
    {
        "question": "Do I get lifetime access to purchased courses?",
        "answer": "Yes, once enrolled, you receive lifetime access to all lectures, downloadable resources, future updates, and community forums for that course.",
        "category": "Courses & Access",
    },
    {
        "question": "Can I access courses on mobile devices?",
        "answer": "Yes, our web application is fully mobile-responsive. You can seamlessly watch video lectures, review notes, and take quizzes on any modern smartphone or tablet browser.",
        "category": "Courses & Access",
    },
    {
        "question": "Can I download course videos for offline viewing?",
        "answer": "Video streaming requires an active internet connection. However, supplementary course materials, slides, source code repositories, and cheat sheets can be downloaded offline.",
        "category": "Courses & Access",
    },
    {
        "question": "Are there any prerequisites before taking advanced courses?",
        "answer": "Each course listing page has a 'Prerequisites' section detailing necessary background knowledge, recommended prior courses, and recommended software setups.",
        "category": "Courses & Access",
    },
    {
        "question": "Is there a time limit or deadline to complete a course?",
        "answer": "No. All self-paced courses allow you to learn on your own schedule with zero deadlines or expiration dates.",
        "category": "Courses & Access",
    },

    # Category: Certificates & Verification
    {
        "question": "How do I download my certificate of completion?",
        "answer": "After finishing 100% of the course curriculum and passing required assessments, go to 'My Learning', open the course, and click 'Download Certificate'.",
        "category": "Certificates",
    },
    {
        "question": "Can I add my certificate to LinkedIn?",
        "answer": "Yes! On your certificate viewer page, click 'Add to LinkedIn' to automatically populate the credential ID and public verification URL on your LinkedIn profile.",
        "category": "Certificates",
    },
    {
        "question": "Can I change the legal name printed on my certificate?",
        "answer": "Yes. Update your full name under 'Account Settings' -> 'Profile', then regenerate your certificate from the certificate details view.",
        "category": "Certificates",
    },
    {
        "question": "How can employers verify my certificate credentials?",
        "answer": "Every certificate includes a unique verification link and QR code that allows employers or institutions to verify authenticity on our public verification portal.",
        "category": "Certificates",
    },

    # Category: Technical Support
    {
        "question": "How do I contact customer support?",
        "answer": "You can reach our 24/7 support team via email at support@coursemate.ai or through the 'Live Chat' bubble located at the bottom-right corner of your dashboard.",
        "category": "Technical Support",
    },
    {
        "question": "Why is the video player buffering or not loading?",
        "answer": "Try switching video quality from Auto to 720p/480p, clear your browser cache, disable conflicting ad-blockers, or ensure hardware acceleration is turned on in your browser settings.",
        "category": "Technical Support",
    },
    {
        "question": "Which web browsers are supported?",
        "answer": "We recommend the latest versions of Google Chrome, Mozilla Firefox, Microsoft Edge, Brave, and Apple Safari for optimal playback and interactive coding sandbox features.",
        "category": "Technical Support",
    },
    {
        "question": "How do I ask the course instructor a question?",
        "answer": "Use the 'Q&A' tab beneath any video lesson to post a question directly to the course instructor and teaching assistants.",
        "category": "Technical Support",
    },
    {
        "question": "Why isn't my quiz or assignment score updating?",
        "answer": "Ensure you click 'Submit Final Answers' upon completion. If scores fail to sync, refresh the page or check if you have an active network connection.",
        "category": "Technical Support",
    },
]


def seed_database():
    """Initializes DB and inserts sample FAQs if none exist or if forced."""
    init_db()
    db = SessionLocal()
    try:
        count = db.query(FAQ).count()
        if count == 0:
            print(f"[*] Seeding database with {len(SAMPLE_FAQS)} sample FAQs...")
            for item in SAMPLE_FAQS:
                faq = FAQ(
                    question=item["question"],
                    answer=item["answer"],
                    category=item["category"],
                )
                db.add(faq)
            db.commit()
            print("[+] Successfully seeded database!")
        else:
            print(f"[i] Database already contains {count} FAQs. Skipping seed.")
    finally:
        db.close()


def force_reseed_database():
    """Clears and reseeds sample FAQs."""
    init_db()
    db = SessionLocal()
    try:
        db.query(FAQ).delete()
        for item in SAMPLE_FAQS:
            faq = FAQ(
                question=item["question"],
                answer=item["answer"],
                category=item["category"],
            )
            db.add(faq)
        db.commit()
        return len(SAMPLE_FAQS)
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
