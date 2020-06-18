const labels = [{
    value: 'poverty',
    label: 'In Poverty(%)',
    inactive: false,
    active: true,
    xAxis: true,
  },

  {
    value: 'age',
    label: 'Age(Median)',
    inactive: true,
    active: false,
    xAxis: true,
  },
  {
    value: 'income',
    label: 'Household Income(Median)',
    inactive: true,
    active: false,
    xAxis: true,
  },
  {
    value: 'obesity',
    label: 'Obese(%)',
    inactive: true,
    active: false,
    xAxis: false, // i.e. yAxis
  },
  {
    value: 'smokes',
    label: 'Smokes(%)',
    inactive: true,
    active: false,
    xAxis: false,
  },
  {
    value: 'healthcare',
    label: 'Lack of Healthcare(%)',
    inactive: false,
    active: true,
    xAxis: false,
  }
];

export {
  labels
};