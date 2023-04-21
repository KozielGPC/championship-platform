// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  main: {
    "darkBlue": "rgb(13, 71, 161)",
    "darkPurple": "rgb(21, 62, 117)",
    "lightBlue": "rgb(42, 105, 172)",
    "red":"rgb(234, 20, 60)",
    'greenLemon':"rgb(205, 220, 57)",
    "darkGrey": "rgb(34, 34, 34)"
  },
}

export default extendTheme({ colors })