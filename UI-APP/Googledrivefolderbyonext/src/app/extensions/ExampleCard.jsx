import React, { useState } from 'react';
import { Modal, Text, Button } from '@hubspot/ui-extensions';
import { hubspot } from '@hubspot/ui-extensions';

hubspot.extend(() => <Extension />);

const Extension = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Text>
        This extension demonstrates how to use the Google Drive API to create a folder in Google Drive and then link it to a HubSpot deal.
      </Text>
      <Button onClick={openModal}>Open Modal</Button>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <Text>Your content here</Text>
        {/* Embed your iframe here */}
        <iframe
          src="https://your-website.com"
          width="100%"
          height="500px"
          frameBorder="0"
          title="Embedded Content"
        ></iframe>
        <Button onClick={closeModal}>Close</Button>
      </Modal>
    </>
  );
};
