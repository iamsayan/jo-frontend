import type { Metadata } from "next";
import MainLayout from "@/components/main-layout";
import Section from "@/components/section";
import schema from "@/utils/schema";
import { metadata as metadataSchema } from "@/app/layout";

export const metadata: Metadata = {
    title: "History of Jagadhatri Puja",
    description: "Discover the rich history of Jagadhatri Puja in Chandannagar—from ancient origins to today’s massive public celebrations.",
    openGraph: {
        ...metadataSchema.openGraph,
        url: "/puja-history",
    },
    alternates: {
        canonical: "/puja-history",
    },
};

export default function Page() {
    const jsonLd = schema({
        path: "puja-history",
        title: "History of Jagadhatri Puja",
    });

    return (
        <MainLayout title="Puja History" jsonLd={jsonLd}>
            <Section title="Know More About" description="Jagadhatri Puja">
                <div className="flex flex-col gap-6 text-justify">
                    <p>
                        When the entire Bengal, nay India, was under the British rule, inspite of being under the French administration at that time
                        Chandannagar created a distinct tradition. Jagadhatri Puja is a major socio-cultural event in this region.
                    </p>
                    <p>
                        The ancient history of Jagadhatri Puja in Chandannagar is unknown even today. It is heard that Indranarayan Chowdhury
                        introduced the Jagadhatri Puja in Chandannagar in the manner of King Krishnachandra of Krishnanagore. The time of beginning of
                        Jagadhatri Puja in Krishnanagore was 1762. Indranarayan Choudhury died in 1756. So Indranarayan Choudhury by no means
                        introduce the Jagadhatri puja in Chandannagar. The beginning of Jagadhatri puja in Chandannagar probably dates back earlier
                        than 1750. Indranarayan Choudhury performed the Jagadhatri puja at his own house in Chandannagar, at the time Krishna Chandra
                        used to come to borrow money from Indranarayan Choudhury. Perhaps Krishnachandra was attracted to greatness of Jagadhatri at
                        this time.
                    </p>
                    <p>
                        The formal difference between Durga and Jagadhatri occurs in ‘Mayatantra’ and Jagadhatri is mentioned with reference to Durga
                        in Krishnanda’s ‘Tantasaar’. The ruling to perform the special puja of the goddess on the ninth lunar day of the light
                        fortnight in the month of Kartick has ben referred in ‘Krityatattarnab’ by Srinath Acharyachuramoni of the 15th-16th century.
                        The fourhanded goddess is carried by the lion everywhere, an elephantlies of the feet of the lion. The idol has an old
                        fashioned shaping, i.e. the face cutting is of a longish pattern; it has large eyes spread upto the years and the four hands
                        display conch, discus, shaft, and bow respectively. The snake is her sacred thread. One of the main attraction of Jagadhatri
                        idol of Chandannagar is the ornamental decoration of the goddess with sola and beautiful canvas of mats with painting at the
                        back of the image.
                    </p>
                    <p>
                        The Jagadharti Puja was first started by Maharaja Krishnachandra of Krishnanagar, Nadia in Bengal. Jagadhatri Puja is very
                        popular in Krishnanagar, Rishra, Chandannagar, Bhadreswar, Hooghly, Boinchi.
                    </p>
                    <p>
                        The Jagadhatri puja of Bose family, Palpara, deserves a special mention in this regard. The puja of this family initially used
                        to be held in their ancestral home in Murshidabad. Folklore has it that this puja was started in 1788. The puja was later
                        shifted to its present location in Chandannagar, where many of the family members now live. The exact history of the deity is
                        unknown, but family records date it back to 1640. The beauty of the festival in Chandannagar is mainly due to the
                        collaborative conception between the French and Bengalis . Remarkable feature remaining its’ procession , second largest in
                        the world after Rio de Janeiro’s, with its’ magnificent lightings.
                    </p>
                    <p>
                        Jagadhatri means who holds the universe and who protects the world from cruel demons. Devi Jagadhatri is also known as
                        Karindrasuranisudini (Who killed the elephant demon), Maheswari (the Great Goddess), Shaktacharpriya (the Goddess who loves to
                        be worshipped according to Shaktism) and Adharabhuta (the Bearer of the World). Devi Jagadhatri is a pleasant form of Goddess
                        Durga and symbolizes ‘Sattva Guna’. One of the six major schools of Indian Philosophy is called Sankhya or Samkhya and
                        according to it the three ‘Gunas’ or qualities, Sattva, Rajas and Tamas form the ‘Prakriti’ or ‘universal nature’ Sattva
                        (calmness, purity) – It is symbolized by Goddess Jagadhatri, and is associated with creation. Rajas (activity, ‘dim’) – It is
                        symbolized by Goddess Durga, and is associated with preservation. Tamas (inertia, dark) – It is symbolized by Goddess Kali,
                        and is associated with destruction for better creation. According to ‘Tantras’ and ‘Puranas’, Devi Jagadhatri has three eyes
                        and has four arms holding conch, chakra, bow and arrow respectively. Jagadhatri rides on a lion which stands on an elephant.
                        She is dressed with colourful clothes and bright jewels. Another important feather of this idol is its ornamental decorations
                        with sola and beautiful canvas of mats behind the idol. The snakes is her sacred thread. Sri Ramakrishnadev , the great
                        devotee of Makali Said, ‘Jagadhatri awakens in the heart of such person who can control the tenacious elephant called mind.’
                    </p>

                    <p>
                        Jagaddhatri figures in the semi-historical fictional work ‘Anandamath’ written by Bankim Chandra Chatterjee, from which book
                        the national song of India “Vande Mataram” is taken. In the novel, Kali, Durga and Jagaddhatri are depicted as three aspects
                        of ‘Bharat Mata’ (Mother India) – Jagaddhatri as the mother used to be, Kali as the mother now is, Durga as the mother will be
                        in future. The trio of goddesses are shown as the object of worship of a group of ascetics who form the protagonists of the
                        story.
                    </p>
                    <p>
                        The number of community pujas in Chandannagar, Bhadreswar and Champdany Municipal areas crosses 190 mark. Of these, 161 Puja
                        committees in different localities in Chandannagar and Bhadreswar areaffiliated to the Chandannagar Central Jagadhatri Puja
                        Committee. The Central committee renders all possible assistance to its constituents in getting permissions and clearances for
                        holding Puja. The immersion procession is really memorable and enjoyable sight to witness which lakh of people throng in
                        Chandannagar from far and near. The beautiful decorated tall images loaded on trucks are taken around the city in a
                        procession.
                    </p>
                    <p>
                        Tamosa ma jyotirgamay : Oh Mother! take me to the world of light from darkness! The concept of illuination of mind is also
                        related to the illumination of the world. And so in each and every festival of India ‘light’ symbolises a desire for a
                        brighter tomorrow. The concept of ‘light’ in festivities is universal and has been conceived as a strong unifying force.
                    </p>
                    <p>
                        Technological advancement in all walks of life has had its deep impact on the concept of lighting as well – from the archaic
                        concept of lighting with oil lamps to candle lights on to carbide gas lights, tulip lights , tube lights, chandeliers and
                        twinklings.
                    </p>
                    <p>
                        When it comes to discussing the latest and creative in lighting, the name of Chandannagar can not escape mention. About 5,000
                        people in Chandannagar alone and about 40,000 in the entire Hooghly district and its neighbourhood are engaged in someway or
                        the other in this industry. The artisans here offer a scintallating range of splendour and spectacle. Multi-coloured tulip
                        bulbs fitted on woven wires, create a semblance of motion through lights generating images of moving bicycles, cars, trains,
                        buds bloosoming into flowers, fire-spitting dragons and so on.
                    </p>
                    <p>
                        In fact, there is no end to Chandannagar creations. Innovations in creating images through lighting on contemporary issues
                        like Amatya Sen receiving the Nobel Prize, tennis ace Leander Paes making a serve, cricketer Sourav Ganguly driving a
                        magnificient shot regale the onlookers. The craze for lighting is not restricted to the puja pandals alone, but even in sports
                        events, corporate events, wedding etc with cost ranging between Rs 2,000 to five lakh or even more.
                    </p>
                    <p>
                        It is difficult to say why Chandannagar became the centre of light industry. Some say that it may be due to the special
                        flavour attached to the local festivals which have given the impetus to the proliferation of this unique craft. There has
                        always been intense competition among the lighting artisans to outdo each other in terms of decoration. A pageant of floats
                        and illumination precedes the immersion and every puja committee tries to make the best floats.
                    </p>
                    <p>The wizards: Sridhar Das, Kashinath Neogie and so on.</p>
                </div>
            </Section>
        </MainLayout>
    );
}
