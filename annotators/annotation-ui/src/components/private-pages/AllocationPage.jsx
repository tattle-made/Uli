import React from "react";
import { Box } from "grommet";
import AllocationList from "../AllotationList";
import { AppContentSection } from "../AppContentSection";

const AllocationPage = () => {
  return (
    <AppContentSection>
      <Box
        flex={{
          grow: 6,
        }}
      >
        <AllocationList />
      </Box>
      <Box
        flex={{
          grow: 1,
        }}
        round={"small"}
        responsive
        background={"visuals-1"}
        pad={"small"}
      >
        Sidebar
      </Box>
    </AppContentSection>
  );
};

export default AllocationPage;
