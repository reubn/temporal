import React from 'react'
import {Appearance, useColorScheme} from 'react-native-appearance'

import {dark, light} from './appColours'

export {mapboxToken} from './secrets'

export const appColours = {dark, light}[Appearance.getColorScheme()] || light
export const useAppColours = () => {
  const mode = useColorScheme()

  return {dark, light}[mode] || light
}

export const withUseAppColours = Component => {
  return props => {
    const appColours = useAppColours()

    return <Component {...props} appColours={appColours} />
  }
}

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
    colour: 'hsla(210, 100%, 65%, 1)'
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
    colour: 'hsla(30, 100%, 52%, 1)'
  },
  {
    searchString: 'CBL(small)',
    category: 'cbl-s',
    title: 'Small CBL',
    colour: 'hsla(320, 100%, 63%, 1)'
  },
  {
    searchString: 'CBL(L)',
    category: 'cbl-b',
    title: 'Big CBL',
    colour: 'hsla(320, 100%, 63%, 1)'
  },
  {
    searchString: 'CSTLC',
    category: 'cs',
    title: 'Clinical Skills',
    colour: 'hsla(55, 100%, 60%, 1)'
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
    title: '',
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
  title: '',
  colour: 'hsla(0, 0%, 64%, 1)'
}

export const locationFinder = ({code, category}) => {
  if(category === 'harc') return {
    description: `Top Floor
Sherrington Building`,
    buildingCode: 'SHER'
  }
  if(category === 'cs') return {
    description: `Clinical Skills & Learning Centre
Block E
Waterhouse Building`,
    buildingCode: 'O-WH'
  }

  return {
    description: '',
    buildingCode: ''
  }
}
