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

  const isSingleRule = (query) => Object.keys(query).includes("$or") || Object.keys(query).includes("$and");

  const handleSingleRule = (query) =>
    //['$or', '$and'].includes(Object.keys(query))
    isSingleRule(query)
      ? query
      : { $or: [query] };

  if (typeof config.filter?.show?.target === 'number') {
    config.filter.show.target = String(config.filter.show.target);
  }
  if (typeof config.filter?.enable?.target === 'number') {
    config.filter.enable.target = String(config.filter.enable.target);
  }
  if (config.filter && Object.keys(config.filter).length > 0) {
    for (const type of ['show', 'enable']) {
      if (config.filter[type]?.target) {
        config.filter[type] = {
          query: handleSingleRule(handleLegacyFilter(config.filter[type])),
        };
      }

      // console.log("---");
      // console.log(config.filter[type]);
      // console.log(config.filter);
      // console.log("---");

      if (config.filter[type]) {

        // console.log("BEFORE");
        // console.log(config.filter[type]);
        // console.log(isSingleRule(config.filter[type].query));
        // console.log(['$or', '$and'].includes(Object.keys(config.filter[type].query)));

        config.filter[type] = {
          query: handleSingleRule(config.filter[type].query)
        };

        // console.log("-");
        // console.log(config.filter[type]);
        // console.log(config.filter);
        // console.log("-");
      }
    }
  }
  return config;
}
