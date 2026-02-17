import { Link } from 'gatsby';
import { Text } from 'grommet'
import styled from "styled-components";
import React from 'react'

// // Navlink component for the new design
// export default function NavLink({children, className=""}) {
//   return (
//     <Text className={`cursor-pointer hover:text-[#F28948] hover:underline #{className}`}>{children}</Text>
    
//   )
// }

export const NavLinkNew = styled(Link)`
  text-decoration: none;
  color: inherit;
  &:hover {
  color: #F28948;
  text-decoration: underline;
  }
`;
