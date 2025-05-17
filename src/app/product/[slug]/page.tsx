'use client';
import React from 'react'
import { usePathname } from "next/navigation";
import { ItemProps, ItemCartProp } from './../../types';
import { NavbarDemo } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import PopUp from '@/app/components/PopUp';
import { Bread } from '@/app/components/Products';
import { Anchor, Button, TextInput, NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form'
import { Delivery } from '@/app/components/Content';
import { Item } from '@/app/components/Products';

const Product = () => {
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const product: ItemProps = {
        id: lastSegment?.toString() || '1',
        title: "Flori de bucătărie",
        imageSrc: "/flower.jpeg",
        isPopular: true,
        stockCode: "123",
        inStock: true,
        category: {
            standard: {
                price: 150,
            },
            premium: {
                price: 200,
            },
            basic: {
                price: 100,
            }
        },
        description: "Expertii florariei online Buchetul Simonei au creat buchetul de trandafiri mov si hortensii, o combinatie plina de eleganta si farmec. Trandafirii mov aduc o nota misterioasa si rafinata, cu petalele lor catifelate si culoarea lor unica, simbolizand iubirea profunda. Hortensiile completeaza buchetul cu petalele voluminoase si frumusetea lor uimitoare. Hortensiile transmit o energie pozitiva si un sentiment de apreciere si recunostinta. Buchetul de trandafiri mov si hortensii este perfect pentru a sarbatori iubirea, pentru a aduce bucurie si pentru a impresiona persoana draga. Fie ca este oferit ca un cadou de aniversare, pentru a exprima recunostinta sau pur si simplu pentru a aduce o nota de rafinament in viata cuiva, acest buchet va trezi emotii puternice si va crea un moment deosebit. Comanda online acest buchet de trandafiri mov si hortensii si te bucuri de livrare hand-to-hand, in doar cateva ore, in orice loc din Romania.",
        composition: "7 x Aspidistra, 1 x Felicitare FDL, 1 x Gypso, 3 x Hydrangea alba, 1 x Monstera, 3 x Panglica inscriptionata FDL, 1 x Perle cu ac, 5 x Trandafir mov, 4 x Trandafir Pink Floyd",
        flowers: "Hortensii, Trandafiri",
        colors: "Alb, Crem, Mov, Rosu, Roz",
        type: "Buchet de flori"
    }

    const itemsRe: ItemProps[] = [
        { id: '1', title: 'Buchetul Simonei', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
        { id: '2', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
        { id: '3', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
        { id: '4', title: 'Buchete', category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    ]
    

    const [reviewSubmittedValues, setReviewSubmittedValues] = React.useState('');
    const [addProductSubmittedValues, setAddProductReviewSubmittedValues] = React.useState<ItemCartProp>({
        id: '',
        title: '',
        category: '',
        price: 0,
        quantity: 0,
    });
    console.log(reviewSubmittedValues, addProductSubmittedValues);

    const addForm = useForm({
        mode:'uncontrolled',
        initialValues:{
            id: product.id,
            title: product.title,
            category: '',
            price: 0,
            quantity: 0,
        },
        transformValues: (values) => ({
            id: `${values.id}`,
            title: `${values.title}`,
            category: `${values.category}`,
            price: values.price,
            quantity: values.quantity,
        })
    })

    const reviewForm = useForm({
        mode:'uncontrolled',
        initialValues:{
            name: '',
            email: '',
            cod: '',
            message: '',
        },
        transformValues: (values) => ({
            name: `${values.name}`,
            email: `${values.email}`,
            cod: `${values.cod}`,
            message: `${values.message}`
        })
    })

    const [activeButton, setActiveButton] = React.useState({
        button1: true,
        button2: false,
        button3: false,
    })

    const handleSetCategory = ( { button1, button2, button3 } : { button1: boolean, button2: boolean, button3: boolean } ) => {
        setActiveButton({
            button1: button1,
            button2: button2,
            button3: button3,
        })
    
    }

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/' },
        { title: `${product.title}`, href: '/product/${product.id}' },
    ].map((item, index) => (
        <Anchor className="text-gray-500 hover:text-[#b756a64f]" href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    // const data = new Date();
    // data.setHours(data.getHours() + 2);
    {/* <TextInput
            label="Introdu Localitatea"
            placeholder='localitate(Ex: Tamaseni), judet(Ex: Neamt)'
            mt="md"
        />
        <TextInput
            label="Data livrarii"
            mt="md"
            defaultValue={Intl.DateTimeFormat("ro-RO", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(data)}
            />
        <br />     */}

    return (
        <div>
            <PopUp />
            <NavbarDemo>
                <br /><br /><br />
                <div className='mx-8 md:mx-30'>
                    <Bread itemsBread={itemsBread}/>
                </div>
                <div className="relative mx-8 md:mx-40 grid md:grid-cols-2 grid-cols-1 my-10">
                    <img src={product.imageSrc} alt={product.title} className="w-[100%] h-80 md:w-[90%] md:h-110 object-cover" />
                    <form 
                        className='flex flex-col md:px-8 py-8'
                        onSubmit={addForm.onSubmit((values) => setAddProductReviewSubmittedValues(values))}
                    >   
                        {product.isPopular && <span className="text-red-600 font-serif">Popular</span>}       
                        <div className='grid grid-cols-3'>
                            {activeButton.button1 ? <p className="text-2xl font-semibold text-shadow-black">{product.category.basic.price} RON</p>: null}
                            {activeButton.button2 ? <p className="text-2xl font-semibold text-shadow-black">{product.category.standard.price} RON</p>: null}
                            {activeButton.button3 ? <p className="text-2xl font-semibold text-shadow-black">{product.category.premium.price} RON</p>: null}
                            {product.inStock && <span className="flex font-serif justify-end align-bottom">In stoc ~|</span>}
                            {product.inStock && <span className="flex font-serif align-bottom">~ COD-{ product.id }</span>}
                        </div>
                        <h2 className="text-3xl font-thin my-2">{product.title}</h2>
                        <div className='grid grid-cols-3 gap-1.5 my-5'>
                            <Button 
                                bg={activeButton.button1 ? '#b756a64f': 'white'} 
                                disabled={activeButton.button1} 
                                color={'#b756a64f'} 
                                variant='outline' 
                                key={addForm.key('category1')}
                                size='compact-sm'
                                onClick={() => (
                                    handleSetCategory({button1: true, button2: false, button3: false}),
                                    addForm.setValues({ price:product.category.premium.price, category: 'premium'})
                                )}
                            > BASIC </Button>
                            <Button 
                                bg={activeButton.button2 ? '#b756a64f': 'white'} 
                                disabled={activeButton.button2} 
                                color={'#b756a64f'} 
                                variant='outline' 
                                size='compact-sm'
                                key={addForm.key('category2')}
                                onClick={() => (
                                    handleSetCategory({button1: false, button2: true, button3: false}),
                                    addForm.setValues({ price:product.category.premium.price, category: 'standard'})
                                )}
                            > STANDARD </Button>
                            <Button 
                                bg={activeButton.button3 ? '#b756a64f': 'white'} 
                                disabled={activeButton.button3} 
                                color={'#b756a64f'} 
                                variant='outline' 
                                size='compact-sm'
                                key={addForm.key('category3')}
                                onClick={() => (
                                    handleSetCategory({button1: false, button2: false, button3: true}),
                                    addForm.setValues({price: product.category.premium.price, category: 'basic'})
                                )}
                            > PREMIUM </Button>
                        </div>
                        <div className='mt-3'>
                            <p> FLORI PRINCIPALE </p>
                            <p className='px-5'> {product.flowers} </p>
                        </div>
                        <div className='mb-3'>
                            <p> CULOARE PREDOMINANTA </p>
                            <p className='px-5'> { product.colors?.substring(0, product.colors?.indexOf(','))} </p>
                        </div>
                        <div className='flex flex-row gap-10'>
                            <NumberInput 
                                min={0} 
                                max={100}
                                defaultValue={0}
                                key={addForm.key('quantity')}
                                {...addForm.getInputProps('quantity')}
                            />
                            <Button className='w-full' 
                                variant='fill'
                                w={300}
                                bg={'#b756a64f'}
                                type='submit'
                                disabled={addForm.getValues().quantity < 1}
                            >
                                Adaugă în coș
                            </Button>
                        </div>
                        <div className='grid grid-cols-2 mt-4'>
                            <p className='flex justify-end'> <a href=""> Cum comanzi ~ </a></p>
                            <p className='flex justify-start'> <a href="">|~ Cum livram </a></p>
                        </div>
                    </form>
                </div>
                <div className="relative mx-8 md:mx-40 my-10" >
                    <div className='my-5'>
                        <p className='text-xl text-center my-3'> DETALII </p>
                        <p> { product.description } </p>
                    </div>
                    <div>
                        <p className='text-xl text-center my-3'> MAI MULTE INFORMATII </p>
                        <div className='my-2'>
                            <p> COMPONENTE </p>
                            <p className='pb-3 px-4 text-[15px]'> { product.composition } </p>
                        </div>
                        <div className='my-2'>
                            <p> TIPURI DE FLORI </p>
                            <p className='pb-3 px-4 text-[15px]'> { product.flowers } </p>
                        </div>
                        <div className='my-2'>
                            <p> CULOARE FLORI </p>
                            <p className='pb-3 px-4 text-[15px]'> { product.colors } </p>
                        </div>
                        <div className='my-2'>
                            <p> TIP DE PRODUS </p>
                            <p className='pb-3 px-4 text-[15px]'> { product.type } </p>
                        </div>
                        <div className='my-2'>
                            <p> COD PRODUS </p>
                            <p className='pb-3 px-4 text-[15px]'> { product.id } </p>
                        </div>
                    </div>

                </div>
                <div className="relative color-theme md:px-10 py-10 mx-8 md:mx-40 my-10" >
                    <div className='my-5'>
                        <p className='text-xl text-center my-3'> RECENZIE </p>
                        <p className='text-center'> Scrie recenzia ta pentru ”{product.title}” </p>
                    </div>
                    <form 
                        className='grid md:grid-cols-2 grid-cols-1 px-6 md:px-0'
                        onSubmit={reviewForm.onSubmit((values) => setReviewSubmittedValues(JSON.stringify(values, null, 2)))}
                    >
                        <div className='md:pr-40'>
                            <TextInput 
                                label="NUME"
                                required
                                placeholder="Nume"
                                key={reviewForm.key('name')}
                                {...reviewForm.getInputProps('name')}
                            />
                            <TextInput
                                label="EMAIL" 
                                required
                                placeholder="Email"
                                key={reviewForm.key('email')}
                                {...reviewForm.getInputProps('email')}
                            />
                            <TextInput 
                                label="COD COMANDA"
                                required
                                placeholder="COD..."
                                key={reviewForm.key('cod')}
                                {...reviewForm.getInputProps('cod')}
                            />
                        </div>
                        <div>   
                            <Textarea 
                                label="MESAJ"
                                required
                                placeholder="Mesaj..."
                                key={reviewForm.key('message')}
                                {...reviewForm.getInputProps('message')}
                            />
                            <br /><br />
                            <Button 
                                variant='fill'
                                w={280}
                                bg={'gray'}
                                type='submit'
                            >
                                TRIMITE RECENZIE
                            </Button>
                        </div>
                    </form>
                </div>
                {/* recomandari */}
                <div className="relative mx-8 md:mx-40 my-20">
                    <p className='text-center' >PRODUSE RECOMANDATE</p>
                    <div className='grid xl:grid-cols-4 grid-cols-2 gap-4 xl:mx-22 xl:gap-8 my-6'>
                        { itemsRe.map( 
                            (item: ItemProps, idx: number) => (
                                <Item item={item} key={idx} />
                            )
                        )}
                    </div>
                </div>
            </NavbarDemo>
            <Delivery />
            <Footer />
        </div>
    )
}

export default Product