import type { Locale } from "@/i18n/routing";
import type { PublishedPost, RichTextDocument } from "./types";

type LocalizedSeed = {
  title: string;
  description: string;
  content: RichTextDocument;
};

type SeedPost = Omit<
  PublishedPost,
  "locale" | "title" | "description" | "content" | "seoTitle" | "seoDescription"
> & {
  translations: Record<Locale, LocalizedSeed>;
};

function doc(nodes: RichTextDocument["content"]): RichTextDocument {
  return {
    type: "doc",
    content: nodes
  };
}

function paragraph(text: string) {
  return { type: "paragraph" as const, content: [{ type: "text" as const, text }] };
}

function heading(text: string, level = 2) {
  return {
    type: "heading" as const,
    attrs: { level },
    content: [{ type: "text" as const, text }]
  };
}

function quote(text: string) {
  return {
    type: "blockquote" as const,
    content: [paragraph(text)]
  };
}

function bullet(items: string[]) {
  return {
    type: "bulletList" as const,
    content: items.map((item) => ({
      type: "listItem" as const,
      content: [paragraph(item)]
    }))
  };
}

const translations = {
  publicDialogue: {
    uk: {
      title: "Публічний діалог як основа розвитку громад",
      description:
        "Організація відкриває постійний формат для пропозицій, експертних обговорень і співпраці громад.",
      content: doc([
        paragraph(
          "Публічний діалог допомагає перетворювати окремі проблеми громад на зрозумілі пропозиції та спільні рішення."
        ),
        quote(
          "Сильна громадська платформа починається там, де людей уважно слухають і дають пропозиціям шлях до реалізації."
        ),
        heading("Як працює формат"),
        bullet([
          "збір пропозицій від громадян і громад",
          "експертне обговорення важливих тем",
          "підготовка практичних рекомендацій для партнерів та інституцій"
        ]),
        paragraph(
          "Матеріали обговорень публікуватимуться як новини, аналітичні статті або підсумкові документи."
        )
      ])
    },
    en: {
      title: "Public dialogue as the basis for community development",
      description:
        "The organization opens a permanent format for proposals, expert discussions and community cooperation.",
      content: doc([
        paragraph(
          "Public dialogue turns separate community problems into clear proposals and shared decisions."
        ),
        quote(
          "A strong public platform begins where people are listened to carefully and proposals are given a path to implementation."
        ),
        heading("How the format works"),
        bullet([
          "collecting proposals from citizens and communities",
          "expert discussion of important topics",
          "preparing practical recommendations for partners and institutions"
        ]),
        paragraph(
          "Discussion materials will be published as news, analytical articles or final public documents."
        )
      ])
    },
    de: {
      title: "Öffentlicher Dialog als Grundlage der Gemeindeentwicklung",
      description:
        "Die Organisation eröffnet ein dauerhaftes Format für Vorschläge, Expertengespräche und Zusammenarbeit der Gemeinden.",
      content: doc([
        paragraph(
          "Öffentlicher Dialog verwandelt einzelne Probleme der Gemeinden in klare Vorschläge und gemeinsame Entscheidungen."
        ),
        quote(
          "Eine starke öffentliche Plattform beginnt dort, wo Menschen aufmerksam gehört werden und Vorschläge einen Weg zur Umsetzung erhalten."
        ),
        heading("So funktioniert das Format"),
        bullet([
          "Vorschläge von Bürgern und Gemeinden sammeln",
          "wichtige Themen mit Experten diskutieren",
          "praktische Empfehlungen für Partner und Institutionen vorbereiten"
        ]),
        paragraph(
          "Die Ergebnisse der Diskussionen werden als Nachrichten, Analysen oder öffentliche Dokumente veröffentlicht."
        )
      ])
    },
    fr: {
      title: "Le dialogue public comme base du développement local",
      description:
        "L'organisation ouvre un format permanent pour les propositions, les discussions d'experts et la coopération des communautés.",
      content: doc([
        paragraph(
          "Le dialogue public transforme des problèmes locaux séparés en propositions claires et en décisions partagées."
        ),
        quote(
          "Une plateforme publique forte commence là où les personnes sont écoutées attentivement et où les propositions peuvent avancer."
        ),
        heading("Comment fonctionne le format"),
        bullet([
          "recueillir les propositions des citoyens et des communautés",
          "discuter des sujets importants avec des experts",
          "préparer des recommandations pratiques pour les partenaires et les institutions"
        ]),
        paragraph(
          "Les matériaux des discussions seront publiés sous forme d'actualités, d'analyses ou de documents publics."
        )
      ])
    },
    it: {
      title: "Il dialogo pubblico come base dello sviluppo delle comunità",
      description:
        "L'organizzazione apre un formato permanente per proposte, discussioni con esperti e cooperazione tra comunità.",
      content: doc([
        paragraph(
          "Il dialogo pubblico trasforma problemi locali separati in proposte chiare e decisioni condivise."
        ),
        quote(
          "Una piattaforma pubblica forte nasce dove le persone vengono ascoltate con attenzione e le proposte hanno un percorso di attuazione."
        ),
        heading("Come funziona il formato"),
        bullet([
          "raccogliere proposte da cittadini e comunità",
          "discutere temi importanti con esperti",
          "preparare raccomandazioni pratiche per partner e istituzioni"
        ]),
        paragraph(
          "I materiali delle discussioni saranno pubblicati come notizie, articoli analitici o documenti pubblici finali."
        )
      ])
    }
  },
  regionalNetwork: {
    uk: {
      title: "Регіональна мережа для сильних громад",
      description:
        "Майбутня мережа охоплюватиме обласний, районний, міський та громадський рівні, а також українську діаспору.",
      content: doc([
        paragraph(
          "Національна платформа має бути близькою до місцевих потреб. Саме тому регіональна мережа є ключовою частиною розвитку організації."
        ),
        heading("Рівні взаємодії"),
        bullet([
          "обласні та районні координатори",
          "міські й територіальні громади",
          "сільські громади та представники діаспори"
        ]),
        paragraph(
          "Такий підхід дозволяє чути різні голоси й формувати пропозиції, які відповідають реальним умовам."
        )
      ])
    },
    en: {
      title: "A regional network for strong communities",
      description:
        "The future network will cover regional, district, municipal and community levels, as well as the Ukrainian diaspora.",
      content: doc([
        paragraph(
          "A national platform must stay close to local needs. That is why the regional network is a key part of organizational development."
        ),
        heading("Levels of cooperation"),
        bullet([
          "regional and district coordinators",
          "municipal and territorial communities",
          "village communities and diaspora representatives"
        ]),
        paragraph(
          "This approach helps hear different voices and shape proposals that reflect real conditions."
        )
      ])
    },
    de: {
      title: "Ein regionales Netzwerk für starke Gemeinden",
      description:
        "Das künftige Netzwerk umfasst regionale, bezirkliche, kommunale und gemeinschaftliche Ebenen sowie die ukrainische Diaspora.",
      content: doc([
        paragraph(
          "Eine nationale Plattform muss nahe an lokalen Bedürfnissen bleiben. Deshalb ist das regionale Netzwerk ein zentraler Teil der Entwicklung."
        ),
        heading("Ebenen der Zusammenarbeit"),
        bullet([
          "regionale und bezirkliche Koordinatoren",
          "kommunale und territoriale Gemeinden",
          "Dorfgemeinden und Vertreter der Diaspora"
        ]),
        paragraph(
          "Dieser Ansatz hilft, unterschiedliche Stimmen zu hören und realistische Vorschläge zu entwickeln."
        )
      ])
    },
    fr: {
      title: "Un réseau régional pour des communautés fortes",
      description:
        "Le futur réseau couvrira les niveaux régional, district, municipal et communautaire, ainsi que la diaspora ukrainienne.",
      content: doc([
        paragraph(
          "Une plateforme nationale doit rester proche des besoins locaux. Le réseau régional est donc une partie essentielle du développement de l'organisation."
        ),
        heading("Niveaux de coopération"),
        bullet([
          "coordinateurs régionaux et de district",
          "communautés municipales et territoriales",
          "communautés villageoises et représentants de la diaspora"
        ]),
        paragraph(
          "Cette approche permet d'entendre différentes voix et de formuler des propositions adaptées aux conditions réelles."
        )
      ])
    },
    it: {
      title: "Una rete regionale per comunità forti",
      description:
        "La futura rete coprirà livelli regionali, distrettuali, municipali e comunitari, oltre alla diaspora ucraina.",
      content: doc([
        paragraph(
          "Una piattaforma nazionale deve rimanere vicina ai bisogni locali. Per questo la rete regionale è una parte centrale dello sviluppo organizzativo."
        ),
        heading("Livelli di cooperazione"),
        bullet([
          "coordinatori regionali e distrettuali",
          "comunità municipali e territoriali",
          "comunità rurali e rappresentanti della diaspora"
        ]),
        paragraph(
          "Questo approccio aiuta ad ascoltare voci diverse e a formulare proposte adatte alle condizioni reali."
        )
      ])
    }
  },
  publicControl: {
    uk: {
      title: "Громадський контроль і прозорі інституції",
      description:
        "Огляд принципів публічного нагляду, відкритої інформації та довіри між громадянами й інституціями.",
      content: doc([
        paragraph(
          "Громадський контроль не є конфліктом із державними чи місцевими інституціями. Це спосіб зробити рішення зрозумілими, перевірними та відкритими."
        ),
        heading("Пріоритети"),
        bullet([
          "відкритість процедур",
          "публічне пояснення рішень",
          "залучення громадян до оцінки результатів"
        ]),
        paragraph(
          "Організація розвиватиме інструменти для публічного обговорення, збору звернень і формування рекомендацій."
        )
      ])
    },
    en: {
      title: "Public control and transparent institutions",
      description:
        "An overview of public oversight, open information and trust between citizens and institutions.",
      content: doc([
        paragraph(
          "Public control is not a conflict with state or local institutions. It is a way to make decisions understandable, verifiable and open."
        ),
        heading("Priorities"),
        bullet([
          "openness of procedures",
          "public explanation of decisions",
          "citizen participation in evaluating results"
        ]),
        paragraph(
          "The organization will develop tools for public discussion, collecting appeals and shaping recommendations."
        )
      ])
    },
    de: {
      title: "Öffentliche Kontrolle und transparente Institutionen",
      description:
        "Ein Überblick über öffentliche Aufsicht, offene Informationen und Vertrauen zwischen Bürgern und Institutionen.",
      content: doc([
        paragraph(
          "Öffentliche Kontrolle ist kein Konflikt mit staatlichen oder lokalen Institutionen. Sie macht Entscheidungen verständlich, überprüfbar und offen."
        ),
        heading("Prioritäten"),
        bullet([
          "Offenheit der Verfahren",
          "öffentliche Erklärung von Entscheidungen",
          "Bürgerbeteiligung bei der Bewertung von Ergebnissen"
        ]),
        paragraph(
          "Die Organisation entwickelt Werkzeuge für öffentliche Diskussion, Eingaben und Empfehlungen."
        )
      ])
    },
    fr: {
      title: "Contrôle public et institutions transparentes",
      description:
        "Un aperçu de la surveillance publique, de l'information ouverte et de la confiance entre citoyens et institutions.",
      content: doc([
        paragraph(
          "Le contrôle public n'est pas un conflit avec les institutions publiques ou locales. Il rend les décisions compréhensibles, vérifiables et ouvertes."
        ),
        heading("Priorités"),
        bullet([
          "ouverture des procédures",
          "explication publique des décisions",
          "participation citoyenne à l'évaluation des résultats"
        ]),
        paragraph(
          "L'organisation développera des outils pour la discussion publique, la collecte de demandes et la formulation de recommandations."
        )
      ])
    },
    it: {
      title: "Controllo pubblico e istituzioni trasparenti",
      description:
        "Una panoramica su supervisione pubblica, informazione aperta e fiducia tra cittadini e istituzioni.",
      content: doc([
        paragraph(
          "Il controllo pubblico non è un conflitto con istituzioni statali o locali. Serve a rendere le decisioni comprensibili, verificabili e aperte."
        ),
        heading("Priorità"),
        bullet([
          "apertura delle procedure",
          "spiegazione pubblica delle decisioni",
          "partecipazione dei cittadini alla valutazione dei risultati"
        ]),
        paragraph(
          "L'organizzazione svilupperà strumenti per discussioni pubbliche, raccolta di segnalazioni e raccomandazioni."
        )
      ])
    }
  }
};

export const seedPosts: SeedPost[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "public-dialogue-platform",
    coverImage: "/images/public-dialogue.png",
    status: "published",
    commentMode: "anonymous",
    publishedAt: "2026-05-24T09:00:00.000Z",
    createdAt: "2026-05-20T09:00:00.000Z",
    updatedAt: "2026-05-24T09:00:00.000Z",
    author: "RukhUA Editorial Board",
    likeCount: 42,
    commentCount: 8,
    ogImage: "/images/public-dialogue.png",
    translations: translations.publicDialogue
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "regional-network",
    coverImage: "/images/regional-network.png",
    status: "published",
    commentMode: "authenticated",
    publishedAt: "2026-05-12T10:30:00.000Z",
    createdAt: "2026-05-09T10:30:00.000Z",
    updatedAt: "2026-05-12T10:30:00.000Z",
    author: "RukhUA Coordination Office",
    likeCount: 31,
    commentCount: 4,
    ogImage: "/images/regional-network.png",
    translations: translations.regionalNetwork
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "public-control-transparency",
    coverImage: "/images/public-control.png",
    status: "published",
    commentMode: "disabled",
    publishedAt: "2026-04-28T08:15:00.000Z",
    createdAt: "2026-04-22T08:15:00.000Z",
    updatedAt: "2026-04-28T08:15:00.000Z",
    author: "RukhUA Public Council",
    likeCount: 56,
    commentCount: 0,
    ogImage: "/images/public-control.png",
    translations: translations.publicControl
  }
];
