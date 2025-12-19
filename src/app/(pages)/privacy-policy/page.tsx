import type { Metadata } from 'next';
import MainLayout from '@/components/main-layout';
import Section from '@/components/section';
import schema from '@/utils/schema';
import { metadata as metadataSchema } from '@/app/layout';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description:
        'See how Jagadhatri Online™ protects your data. Your trust is our top priority during puja season and beyond.',
    openGraph: {
        ...metadataSchema.openGraph,
        url: '/privacy-policy',
    },
    alternates: {
        canonical: '/privacy-policy',
    },
};

export default function Page() {
    const jsonLd = schema({
        path: 'privacy-policy',
        title: 'Privacy Policy',
    });

    return (
        <MainLayout title="Privacy Policy" jsonLd={jsonLd}>
            <Section title="Read Our" description="Privacy Policy">
                <div className="flex flex-col gap-6 text-justify">
                    <h2>
                        <strong>
                            This document was last updated on 10th March, 2024.
                        </strong>
                    </h2>
                    <h3>
                        <strong>Privacy Policy for Using Google Ads:</strong>
                    </h3>

                    <p>
                        This Privacy Policy governs the manner in which Google
                        Ads collects, uses, maintains, and discloses information
                        collected from users ("Users") of the Google Ads service
                        ("Service").
                    </p>

                    <p>
                        <strong>Personal Identification Information:</strong>{' '}
                        Google Ads may collect personal identification
                        information from Users in various ways, including, but
                        not limited to, when Users visit our site, register,
                        fill out a form, and in connection with other
                        activities. Users may be asked for name, email, mailing
                        address, phone number, and credit card information.
                        Users may visit the Service anonymously. We collect
                        personal information only if submitted voluntarily.
                        Refusal may limit some Service-related activities.
                    </p>

                    <p>
                        <strong>
                            Non-personal Identification Information:
                        </strong>{' '}
                        Google Ads may collect non-personal identification
                        information such as browser type, device details, and
                        technical connection data.
                    </p>

                    <h4>How We Use Collected Information:</h4>
                    <ul>
                        <li>To improve customer service</li>
                        <li>To personalize user experience</li>
                        <li>To improve our Service</li>
                        <li>To process payments</li>
                        <li>To run promotions, contests, or surveys</li>
                        <li>
                            To send Users information they agreed to receive
                        </li>
                        <li>
                            To send periodic emails (with unsubscribe options)
                        </li>
                    </ul>

                    <h3>
                        <strong>JO Stream App Privacy Policy:</strong>
                    </h3>

                    <p>
                        JagadhatriOnline Team built the JO Stream app as a Free
                        app. This SERVICE is provided by JagadhatriOnline at no
                        cost and is intended for use as is.
                    </p>

                    <p>
                        This page informs app users regarding our policies on
                        the collection, use, and disclosure of Personal
                        Information for those using our Service.
                    </p>

                    <p>
                        By using our Service, you agree to the collection and
                        use of information as per this policy. We only use your
                        Personal Information to provide and improve the Service.
                        We do not share your information with anyone except as
                        described here.
                    </p>

                    <p>
                        We don’t collect or share any data. The app is only for
                        LIVE Streaming on our platform.
                    </p>

                    <p>
                        The terms used here have the same meanings as in our
                        Terms of Use, unless otherwise defined.
                    </p>

                    <h3>
                        <strong>CGR Utsav App Privacy Policy:</strong>
                    </h3>

                    <p>
                        JagadhatriOnline Team built the CGR Utsav app as a Free
                        app. This SERVICE is provided by JagadhatriOnline at no
                        cost and is intended for use as is.
                    </p>

                    <p>
                        This page informs app users regarding our policies on
                        the collection, use, and disclosure of Personal
                        Information for those using our Service.
                    </p>

                    <p>
                        By using our Service, you agree to the collection and
                        use of information as per this policy. The Personal
                        Information we collect is only used to provide and
                        improve the Service.
                    </p>

                    <p>
                        To delete data, users must contact us at{' '}
                        <a href="mailto:info@jagadhatrionline.co.in">
                            info@jagadhatrionline.co.in
                        </a>
                        .
                    </p>

                    <h3>
                        <strong>Information Collection and Use</strong>
                    </h3>

                    <p>
                        We may ask for personally identifiable information to
                        enhance user experience. This data will be stored
                        securely and used as described.
                    </p>

                    <p>
                        The app may use third-party services that collect
                        information to identify you. This list may vary
                        depending on changes in the app.
                    </p>

                    <h3>
                        <strong>Account and User Profile Information</strong>
                    </h3>

                    <ul>
                        <li>Facebook/Gmail profile</li>
                        <li>User preferences</li>
                        <li>Location access</li>
                        <li>DOB, name, photo, gender</li>
                        <li>App-specific data</li>
                        <li>Log Data</li>
                    </ul>

                    <p>
                        <strong>Log Data:</strong> In case of errors, we collect
                        data including IP address, device name, OS version,
                        configuration, timestamp, and other statistics.
                    </p>

                    <h3>
                        <strong>Cookies</strong>
                    </h3>

                    <p>
                        Cookies are small files used as anonymous unique
                        identifiers. They are stored on your device. The app
                        doesn’t explicitly use cookies but may integrate
                        third-party libraries that do. You can accept or refuse
                        cookies, though some features may not work without them.
                    </p>

                    <h3>
                        <strong>Service Providers</strong>
                    </h3>

                    <p>We may employ third parties for:</p>
                    <ul>
                        <li>Facilitating our Service</li>
                        <li>Providing Service on our behalf</li>
                        <li>Performing Service-related functions</li>
                        <li>Analyzing Service usage</li>
                    </ul>

                    <p>
                        These third parties have access to your data only to
                        perform specific tasks and are prohibited from misuse.
                    </p>

                    <h3>
                        <strong>Security</strong>
                    </h3>

                    <p>
                        We strive to protect your data using commercially
                        acceptable means. However, no method is 100% secure and
                        we cannot guarantee absolute security.
                    </p>

                    <h3>
                        <strong>Links to Other Sites</strong>
                    </h3>

                    <p>
                        This Service may contain links to external websites. We
                        are not responsible for their content or privacy
                        policies. Please review their policies individually.
                    </p>

                    <h3>
                        <strong>Children’s Privacy</strong>
                    </h3>

                    <p>
                        Services do not address users under age 13. If we
                        discover such data, we delete it immediately.
                        Parents/guardians should contact us if needed.
                    </p>

                    <h3>
                        <strong>Changes to This Privacy Policy</strong>
                    </h3>

                    <p>
                        We may update our Privacy Policy from time to time.
                        Changes will be posted here and are effective
                        immediately.
                    </p>

                    <h3>
                        <strong>Contact Us</strong>
                    </h3>

                    <p>
                        For any questions or suggestions, contact us at:{' '}
                        <a href="mailto:cgrjagadhatripuja@gmail.com">
                            cgrjagadhatripuja@gmail.com
                        </a>
                    </p>

                    <h3>
                        <strong>Community Privacy Policy:</strong>
                    </h3>

                    <ol>
                        <li>
                            Design, layout, and internal group discussions must
                            not be shared with third parties.
                        </li>
                        <li>
                            Members must seek admin approval before taking
                            decisions regarding the page or website.
                        </li>
                        <li>
                            All posts (news, pictures, etc.) require admin
                            approval before sharing.
                        </li>
                        <li>
                            Any changes to the page or website must be reported
                            to the admin first.
                        </li>
                        <li>
                            Members experiencing issues or harassment should
                            report it to the admin in private; action will
                            follow after assessment.
                        </li>
                        <li>
                            Members leaking copyrighted content will face
                            disciplinary actions.
                        </li>
                    </ol>

                    <h3 id="child-safety-exploitation-policy">
                        <strong>Child Safety & Exploitation Policy:</strong>
                    </h3>
                    <p>
                        At CGR Utsav, we are committed to maintaining a safe and
                        positive environment for all users. Protecting children
                        from sexual abuse, exploitation, and any form of harm is
                        one of our highest priorities.
                    </p>

                    <h2>
                        1. Zero Tolerance for Child Sexual Abuse and
                        Exploitation (CSAE)
                    </h2>
                    <p>
                        We strictly prohibit any form of child sexual abuse or
                        exploitation on our platform. This includes, but is not
                        limited to:
                    </p>
                    <ul>
                        <li>
                            Sharing, uploading, or promoting child sexual abuse
                            material (CSAM).
                        </li>
                        <li>
                            Engaging in grooming, solicitation, or communication
                            intended to exploit or endanger minors.
                        </li>
                        <li>
                            Any act or content that harms the physical,
                            emotional, or psychological well-being of a child.
                        </li>
                    </ul>
                    <p>
                        Any violation of this policy will result in immediate
                        removal of the offending content, permanent suspension
                        or termination of the user account, and reporting to
                        appropriate law enforcement authorities.
                    </p>

                    <h2>2. Reporting Concerns</h2>
                    <p>
                        Users can report any suspicious content or behavior
                        directly within the app using the “Report” or “Flag”
                        option. Alternatively, you may contact our dedicated
                        child safety team via{' '}
                        <a href="mailto:cgrjagadhatripuja@gmail.com">email</a>.
                    </p>
                    <p>
                        All reports are reviewed promptly, and necessary actions
                        are taken to protect our community.
                    </p>

                    <h2>3. Cooperation with Law Enforcement</h2>
                    <p>
                        We fully cooperate with law enforcement agencies and
                        child protection organizations in investigating and
                        addressing any reports of child sexual exploitation or
                        abuse. We may share relevant user information or content
                        details as required by applicable laws.
                    </p>

                    <h2>4. Commitment to Legal Compliance</h2>
                    <p>
                        [Your App Name] complies with all relevant child
                        protection laws and reporting obligations, including
                        national and international standards related to CSAE and
                        CSAM. We also adhere to Google Play’s Child Safety
                        Standards and applicable privacy and data protection
                        laws regarding minors.
                    </p>

                    <h2>5. Continuous Monitoring and Improvement</h2>
                    <p>
                        Our moderation systems — both automated and human —
                        continuously monitor user-generated content to detect
                        and prevent harmful activities. We regularly train our
                        team members to identify and handle child safety issues
                        effectively and responsibly.
                    </p>

                    <h2>6. Contact Information</h2>
                    <p>
                        If you have questions, concerns, or need to report an
                        issue related to child safety, please contact us:
                    </p>

                    <h2>7. Our Commitment</h2>
                    <p>
                        We are dedicated to creating a safe, respectful, and
                        inclusive environment for all users — especially
                        children. By using [Your App Name], you agree to abide
                        by this Child Safety & Exploitation Policy and help us
                        ensure a safer online community.
                    </p>

                    <h3>
                        <strong>COPYRIGHT INFRINGEMENT</strong>
                    </h3>

                    <p>
                        If you wish to report copyright infringement, please
                        email{' '}
                        <a href="mailto:cgrjagadhatripuja@gmail.com">
                            cgrjagadhatripuja@gmail.com
                        </a>{' '}
                        with your full name and address. All valid reports will
                        be investigated within 2 days.
                    </p>
                </div>
            </Section>
        </MainLayout>
    );
}
