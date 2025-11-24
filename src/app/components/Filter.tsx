'use client';
import { IconFilters } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';


const Filter = () => {
    const [opened, { open, close }] = useDisclosure(false);


    return (
        <div>
            <button onClick={() => {open()}} className='flex items-center justify-center h-[34px] w-[34px] cursor-pointer'>
                <IconFilters size={20} />
            </button>

            <Modal opened={opened} onClose={close} title="Filtrare" withCloseButton={true} fullScreen={true} centered overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}>
                
            </Modal>    

        </div>
    );
};

export default Filter;