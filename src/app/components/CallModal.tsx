'use client';
import { Modal, Button, Group, CopyButton, Tooltip, ActionIcon } from '@mantine/core';
import { IconCheck, IconCopy, IconPhoneCall } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';

export const CallModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened}
        onClose={close}
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}>
        <Group px={4}>
          <p className="w-[80%]"> 0769141250 </p>
          <CopyButton value="0769141250" timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Modal>

      <Button variant="transparent" color="green" onClick={open} p={0} pr={16}>
        <IconPhoneCall size={18} />
      </Button>
    </>
  );
}