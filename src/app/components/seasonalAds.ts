interface SeasonalAd {
  imageSrc: string;
  buttonText: string;
  buttonLink: string;
  season: string;
}

export const getSeasonalAd = (): SeasonalAd => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Valentine's Day (Feb 1-14)
  if (month === 2 && day <= 14) {
    return {
      imageSrc: "/Valentine.jpg",
      buttonText: "Oferte speciale de Valentine's Day",
      buttonLink: "/gifts/Valentine's%20Day",
      season: "Valentine's Day"
    };
  }
  
  // Spring (March 1 - May 31)
  if (month >= 3 && month <= 5) {
    return {
      imageSrc: "/Spring.jpg",
      buttonText: "Bucură-te de primăvară cu ofertele noastre",
      buttonLink: "/arrangements/Buchet%20de%20Primavara",
      season: "Primăvară"
    };
  }

    // Easter (March 22 - April 25)
  const isEaster = (month === 3 && day >= 22) || (month === 4 && day <= 25);
  if (isEaster) {
    return {
      imageSrc: "/Easter.jpg",
      buttonText: "Oferte speciale de Paște",
      buttonLink: "/arrangements/Buchet%20de%20Paste",
      season: "Paște"
    };
  }
  
  // Summer (June 1 - August 31)
  if (month >= 6 && month <= 8) {
    return {
      imageSrc: "/Summer.avif",
      buttonText: "Oferte speciale de vară",
      buttonLink: "/arrangements/Buchet%20de%20Vara",
      season: "Vară"
    };
  }
  
  // Autumn (September 1 - November 30)
  if (month >= 9 && month <= 11) {
    return {
      imageSrc: "/Autumn.webp",
      buttonText: "Culorile toamnei în aranjamentele noastre",
      buttonLink: "/arrangements/Buchet%20de%20Toamna",
      season: "Toamnă"
    };
  }
  
  // Winter/Christmas (December 1 - January 31)
  return {
    imageSrc: "/Christmas.webp", // Make sure this image exists in your public folder
    buttonText: "Vezi ofertele de Crăciun",
    buttonLink: "/arrangements/Decoratiuni%20de%20Crăciun",
    season: "Crăciun"
  };
};
