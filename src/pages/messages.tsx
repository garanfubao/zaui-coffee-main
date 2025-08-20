import React from "react";
import { Box, Header, Page, Text } from "zmp-ui";
import appConfig from "../../app-config.json";

const MessagesPage: React.FC = () => {
  return (
    <Page>
      <Header title={appConfig.app.title} showBackIcon={false} />
      <Box p={4} className="text-center">
        <Text>Tin nhắn (demo)</Text>
      </Box>
    </Page>
  );
};

export default MessagesPage;