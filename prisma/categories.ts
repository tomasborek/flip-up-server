type Category = {
  title: string;
  applicable?: boolean;
  slug: string;
  core?: boolean;
  subCategories?: {
    title: string;
    slug: string;
    applicable?: boolean;
    subCategories?: {
      title: string;
      slug: string;
      applicable?: boolean;
    }[];
  }[];
};

export const categories: Category[] = [
  {
    title: "Oblečení a doplňky",
    slug: "obleceni-a-doplnky-core",
    core: true,
    subCategories: [
      {
        title: "Dámské oblečení",
        slug: "damske-obleceni-obleceni-a-doplnky",
        subCategories: [
          {
            title: "Trika",
            slug: "trika-damske-obleceni",
            applicable: true,
          },
          {
            title: "Sukně",
            slug: "sukne-damske-obleceni",
            applicable: true,
          },
          {
            title: "Kalhoty",
            slug: "kalhoty-damske-obleceni",
            applicable: true,
          },
          {
            title: "Šaty",
            slug: "saty-damske-obleceni",
            applicable: true,
          },
          {
            title: "Svetry a mikiny",
            slug: "svetry-a-mikiny-damske-obleceni",
            applicable: true,
          },
          {
            title: "Bundy a kabáty",
            slug: "bundy-a-kabaty-damske-obleceni",
            applicable: true,
          },
          {
            title: "Spodní prádlo",
            slug: "spodni-pradlo-damske-obleceni",
            applicable: true,
          },
          {
            title: "Plavky",
            slug: "plavky-damske-obleceni",
            applicable: true,
          },
        ],
      },

      {
        title: "Pánské oblečení",
        slug: "panske-obleceni-obleceni-a-doplnky",
        subCategories: [
          {
            title: "Trika",
            slug: "trika-panske-obleceni",
            applicable: true,
          },
          {
            title: "Kalhoty",
            slug: "kalhoty-panske-obleceni",
            applicable: true,
          },
          {
            title: "Svetry a mikiny",
            slug: "svetry-a-mikiny-panske-obleceni",
            applicable: true,
          },
          {
            title: "Bundy a kabáty",
            slug: "bundy-a-kabaty-panske-obleceni",
            applicable: true,
          },
          {
            title: "Spodní prádlo",
            slug: "spodni-pradlo-panske-obleceni",
            applicable: true,
          },
          {
            title: "Plavky",
            slug: "plavky-panske-obleceni",
            applicable: true,
          },
        ],
      },
      {
        title: "Doplňky",
        slug: "doplnky-obleceni-a-doplnky",
        subCategories: [
          {
            title: "Kabelky",
            slug: "kabelky-doplnky",
            applicable: true,
          },
          {
            title: "Brýle",
            slug: "bryle-doplnky",
            applicable: true,
          },
          {
            title: "Šperky",
            slug: "sperky-doplnky",
            applicable: true,
          },
          {
            title: "Čepice",
            slug: "cepice-doplnky",
            applicable: true,
          },
          {
            title: "Hodinky",
            slug: "hodinky-doplnky",
            applicable: true,
          },
        ],
      },
      {
        title: "Dětské oblečení",
        slug: "detske-obleceni-obleceni-a-doplnky",
        applicable: true,
      },
    ],
  },
  {
    title: "Elektronika",
    slug: "elektronika-core",
    core: true,
    subCategories: [
      {
        title: "Mobilní telefony",
        slug: "mobilni-telefony-elektronika",
        applicable: true,
      },
      {
        title: "Počítače a notebooky",
        slug: "pocitace-a-notebooky-elektronika",
        applicable: true,
      },
      {
        title: "Televize",
        slug: "televize-elektronika",
        applicable: true,
      },
      {
        title: "Audio a reproduktory",
        slug: "audio-a-reproduktory-elektronika",
        applicable: true,
      },
      {
        title: "Kamery a fotoaparáty",
        slug: "kamery-a-fotoaparaty-elektronika",
        applicable: true,
      },
      {
        title: "Herní konzole a příslušenství",
        slug: "herni-konzole-a-prislusenstvi-elektronika",
        applicable: true,
      },
      {
        title: "Tiskárny",
        slug: "tiskarny-elektronika",
        applicable: true,
      },
      {
        title: "Doplňky",
        slug: "doplnky-elektronika",
        applicable: true,
      },
    ],
  },
  {
    title: "Domácnost",
    slug: "domacnost-core",
    core: true,
    subCategories: [
      {
        title: "Nábytek",
        slug: "nabytek-domacnost",
        applicable: true,
      },
      {
        title: "Kuchyňské potřeby",
        slug: "kuchynske-potreby-domacnost",
        applicable: true,
      },
      {
        title: "Koupelna a osobní péče",
        slug: "koupelna-a-osobni-pece-domacnost",
        applicable: true,
      },
      {
        title: "Zahrada a venkovní vybavení",
        slug: "zahrada-a-venkovni-vybaveni-domacnost",
        applicable: true,
      },
      {
        title: "Dekorace a osvětlení",
        slug: "dekorace-a-osvetleni-domacnost",
        applicable: true,
      },
      {
        title: "Spotřebiče",
        slug: "spotrebice-domacnost",
        applicable: true,
      },
      {
        title: "Čistící prostředky",
        slug: "cistici-prostreky-domacnost",
        applicable: true,
      },
      {
        title: "Domácí nářadí",
        slug: "domaci-naradi-domacnost",
        applicable: true,
      },
    ],
  },
  {
    title: "Spotřebné zboží a potraviny",
    slug: "spotrebne-zbozi-a-potraviny-core",
    core: true,
    subCategories: [
      {
        title: "Hygienické potřeby",
        slug: "hygienicke-potreby-spotrebne-zbozi-a-potraviny",
        applicable: true,
      },
      {
        title: "Potraviny",
        slug: "potraviny-spotrebne-zbozi-a-potraviny",
        applicable: true,
      },
      {
        title: "Alkohol",
        slug: "alkohol-spotrebne-zbozi-a-potraviny",
        applicable: true,
      },
    ],
  },
  {
    title: "Kosmetika a krása",
    slug: "kosmetika-a-krasa-core",
    core: true,
  },
  {
    title: "Sport a hobby",
    slug: "sport-a-hobby-core",
    core: true,
  },
  {
    title: "Cestování",
    slug: "cestovani-core",
    core: true,
  },
  {
    title: "Umění a ručně vyráběné výrobky",
    slug: "umeni-a-rucne-vyrabene-vyrobky-core",
    core: true,
    applicable: true,
  },
  {
    title: "Zvířata",
    slug: "zvirata-core",
    core: true,
  },
];
