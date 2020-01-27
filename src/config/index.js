export * from './secrets'

export const eventCategories = [
  {
    searchString: 'Lecture',
    category: 'lecture',
    title: 'Lecture',
    colour: 'hsla(199, 100%, 65%, 1)'
  },
  {
    searchString: 'Lecture (Review)',
    category: 'lecture-review',
    title: 'End of Block Review',
    colour: 'hsla(199, 100%, 65%, 1)'
  },
  {
    searchString: 'Critical Analysis',
    category: 'cas',
    title: 'Critical Analysis & Synthesis',
    colour: 'hsla(240, 67%, 60%, 1)'
  },
  {
    searchString: 'CCP',
    category: 'ccp',
    title: 'Communication for Clinical Practice',
    colour: 'hsla(165, 80%, 64%, 1)'
  },
  {
    searchString: 'PSM',
    category: 'psm',
    title: 'Psychology & Sociology',
    colour: 'hsla(42, 100%, 60%, 1)'
  },
  {
    searchString: 'HARC',
    category: 'harc',
    title: 'Human Anatomy Resource Centre',
    colour: 'hsla(0, 100%, 66%, 1)'
  },
  {
    searchString: 'CBL(small)',
    category: 'cbl-s',
    title: 'Small CBL',
    colour: 'hsla(345, 100%, 63%, 1)'
  },
  {
    searchString: 'CBL(L)',
    category: 'cbl-b',
    title: 'Big CBL',
    colour: 'hsla(345, 100%, 63%, 1)'
  },
  {
    searchString: 'CSTLC',
    category: 'cs',
    title: 'Clinical Skills',
    colour: 'hsla(50, 100%, 60%, 1)'
  },
  {
    searchString: 'EoB',
    category: 'test',
    title: 'End of Block Test',
    border: true,
    colour: 'hsla(140, 80%, 64%, 1)'
  },
  {
    type: 'Examination',
    category: 'exam',
    title: 'Exam',
    border: true,
    colour: 'hsla(345, 100%, 63%, 1)'
  },
  {
    searchString: 'Prof Plenary',
    category: 'pel',
    title: 'Profesionalism & Ethics',
    colour: 'hsla(281, 93%, 64%, 1)'
  }
]

export const defaultCategory = {
  category: 'other',
  title: 'Other',
  colour: 'hsla(0, 0%, 0%, 1)'
}
