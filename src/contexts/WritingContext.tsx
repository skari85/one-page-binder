import { createContext } from 'react'
import { WritingContextType } from '../types'

export const WritingContext = createContext<WritingContextType | undefined>(undefined)