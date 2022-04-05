const handleSingleRule = (query) =>
  ['$or', '$and'].includes(Object.keys(query))
    // Oletetaan, että query on tallennettu jo uudessa monen säännön muodossa.
    // Todellisuudessa näin ei ole, koska multiselect-tyyppisistä kysymyksistä riippuvat säännöt käyttävät jo nyt array-tyyppistä sääntöä. Näitä lomakkeita ei kuitenkaan ole tuotannossa, joten se toiminnallisuus voidaan muuttaa.
    ? query
    // *) Tehdään vaikkapa OR-tyyppisen säännön mukainen sääntölista
    : { $or: [query] };


// handleLegacyFilter:in tulos annetaan yllä määritetylle uudelle funktiolle

const handleLegacyFilter = ({
  anyOf,
  allOf,
  includesEvery,
  includesSome,
  ...other
}) =>
  allOf
    ? { $and: allOf.map((filter) => handleOther({ ...other, ...filter })) }
    : anyOf
    ? { $or: anyOf.map((filter) => handleOther({ ...other, ...filter })) }
    : includesEvery
    ? {
        $and: includesEvery.map(($eq) =>
          handleOther({ ...other, $elemMatch: { $eq } })
        ),
      }
    : includesSome
    ? {
        $or: includesSome.map(($eq) =>
          handleOther({ ...other, $elemMatch: { $eq } })
        ),
      }
    : handleOther(other);

const handleOther = ({ target, exists, equals, unequals, ...other }) => ({
  [target]:
    exists !== undefined
      ? { $exists: exists }
      : equals !== undefined
      ? { $eq: equals }
      : unequals !== undefined
      ? { $ne: unequals }
      : other,
});

export default function filter(config) {
  if (typeof config.filter?.show?.target === 'number') {
    config.filter.show.target = String(config.filter.show.target);
  }
  if (typeof config.filter?.enable?.target === 'number') {
    config.filter.enable.target = String(config.filter.enable.target);
  }
  if (config.filter) {
    for (const type of ['show', 'enable']) {
      if (config.filter[type]?.target) {
        config.filter[type] = {
          query: handleSingleRule(handleLegacyFilter(config.filter[type])),
        };
      }
    }
  }
  return config;
}
