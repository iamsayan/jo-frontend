import type { Metadata } from "next";
import MainLayout from "@/components/main-layout";
import Section from "@/components/section";
import schema from "@/utils/schema";
import { metadata as metadataSchema } from "@/app/layout";
export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the user terms for Jagadhatri Online, outlining site usage, copyrights, and community interaction guidelines.",
  openGraph: {
    ...metadataSchema.openGraph,
    url: "/terms",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function Page() {
  const jsonLd = schema({
    path: "terms",
    title: "Terms & Conditions",
  });

  return (
    <MainLayout title="Terms & Conditions" jsonLd={jsonLd}>
      <Section title="Read Our" description="Terms & Conditions">
        <div className="flex flex-col gap-6 text-justify">
          <p>
            Please read these terms and conditions carefully before applying to
            become a member of <strong>Jagadhatri Online</strong> on our
            Website. You should understand that by applying to become a part of
            this Community, you agree to be bound by these terms and conditions.
            To become a member of the Jagadhatri Online Community, follow the
            instructions below.
          </p>

          <p>
            We welcome users to register on our digital platforms. All changes
            will be appended in the terms and conditions pages and communicated
            to existing users by email.
          </p>

          <ol>
            <li>
              The total registration procedure is free. On registration, we
              expect you to provide accurate and complete information in the
              compulsory fields.
            </li>
            <li>
              We also expect you to keep your access credentials secure,
              specifically your password. Each registration is for a single user
              only.
            </li>
            <li>
              Unauthorized use of this website may give rise to a claim for
              damages or a criminal offense. Our service allows you to post,
              share, and otherwise make available certain information, text,
              graphics, videos, or other material (“Content”).
            </li>
            <li>
              You are responsible for the material you post in other places such
              as pages or websites.
            </li>
            <li>
              You must not allow any third party to access the site using your
              username and password or use the site on your behalf. If the
              information provided by the member during registration is found to
              be incorrect, the authority has full rights to take necessary
              action against him/her.
            </li>
            <li>
              All registered members are bound by the Terms and Conditions and
              Privacy Policy. It is the member’s responsibility to protect the
              privacy and policy of the Jagadhatri Online Community. If any
              member creates violence within the group or page, the authority
              has the right to take action against the individual.
            </li>
            <li>
              Off-topic discussions or the use of offensive language will not be
              tolerated within the group. The group is created strictly for
              decision-making and planning purposes only.
            </li>
            <li>
              Members with permission to post photos, videos, and other media
              are requested to consult with the admin beforehand. The use of the
              logo and other copyrighted materials is reserved for the authority
              and must not be shared with third parties.
            </li>
            <li>
              The information provided by members during registration is not
              shared with any other member in the community to ensure privacy.
            </li>
          </ol>

          <p>
            <strong>Note:</strong> The contents of this website are protected
            under copyright held by the owner. Any kind of reproduction is
            strictly prohibited. The developer is not liable for any content on
            the website. The design and layout are registered under Skynix Web
            Studio, and any reproduction is strictly prohibited.
          </p>

          <p>
            The content on the pages of this website is for your general
            information and use only. It is subject to change without notice.
            This material includes, but is not limited to, the operator, the
            design, layout, look, appearance, and graphics. Reproduction is
            prohibited except in accordance with the copyright notice, which
            forms part of these terms and conditions.
          </p>
        </div>
      </Section>
    </MainLayout>
  );
}
