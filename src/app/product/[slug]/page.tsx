'use client';
import React from 'react'
import { usePathname } from "next/navigation";
import { ItemProps, OrderProduct,  } from './../../types';
import { NavbarDemo } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import PopUp from '@/app/components/PopUp';
import { Bread } from '@/app/components/Products';
import { Anchor, Button, TextInput, NumberInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form'
import { Delivery } from '@/app/components/Content';
import { Item } from '@/app/components/Products';
import axios from 'axios';

const URL_COMPOSED_PRODUCTS ='http://localhost:3000/api/products-composed';
const Product = () => {
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const [product, setProduct] = React.useState<ItemProps>(
        {
            id: '',
            title: '',
            imageSrc: '',
            price_category: {
                basic: { price: 0 },
                standard: { price: 0 },
                premium: { price: 0 }
            },
            isPopular: false,
            stockCode: '',
            inStock: false,
            description: '',
            composition: [],
            colors: '',
            type: '',
            promotion: false,
        }
    );

    React.useEffect(() => {
        console.log("Last segment:", lastSegment);
        if (lastSegment) {
            axios.get(`${URL_COMPOSED_PRODUCTS}/${lastSegment}`)
                .then(response => {
                    const data = response.data as ItemProps;
                    setProduct(data);
                })
                .catch(error => {
                    console.error("Error fetching product:", error);
                });
        }
    }, [lastSegment]);


    const itemsRe: ItemProps[] = [
        { id: '1', title: 'Buchetul Simonei', price_category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
        { id: '2', title: 'Buchete', price_category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
        { id: '3', title: 'Buchete', price_category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
        { id: '4', title: 'Buchete', price_category: { basic: { price: 100 }, standard: { price: 100 }, premium: { price: 100 }} },
    ]
    

    const [reviewSubmittedValues, setReviewSubmittedValues] = React.useState('');
    const [addProductSubmittedValues, setAddProductReviewSubmittedValues] = React.useState<OrderProduct>({
        id: '',
        title: '',
        price: 0,
        quantity: 0,
    });
    console.log("Review Submitted Values:", reviewSubmittedValues);
    console.log("Add Product Submitted Values:", addProductSubmittedValues);


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
        { title: `${product.title}`, href: `/product/${product.id}` },
    ].map((item, index) => (
        <Anchor c={"#b756a6"} href={item.href} key={index}>
                {item.title}
        </Anchor>
    ));


    return (
        <div>
            <PopUp />
            <NavbarDemo>
                <br /><br /><br />
                <div className='mx-8 md:mx-30'>
                    <Bread itemsBread={itemsBread}/>
                </div>
                <div className="relative mx-8 md:mx-40 grid md:grid-cols-2 grid-cols-1 my-10">
                    { product.imageSrc &&
                        <img 
                            src={product.imageSrc} 
                            alt={product.title} 
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
                        />
                    }
                    <form 
                        className='flex flex-col md:px-8 py-8'
                        onSubmit={addForm.onSubmit((values) => setAddProductReviewSubmittedValues(values))}
                    >   
                        {product.isPopular && <span className="text-red-600 font-serif">Popular</span>}       
                        <div className='grid grid-cols-3'>
                            {activeButton.button1 ? <p className="text-2xl font-semibold text-shadow-black">{product.price_category.basic.price} RON</p>: null}
                            {activeButton.button2 ? <p className="text-2xl font-semibold text-shadow-black">{product.price_category.standard.price} RON</p>: null}
                            {activeButton.button3 ? <p className="text-2xl font-semibold text-shadow-black">{product.price_category.premium.price} RON</p>: null}
                            {product.inStock && <span className="flex font-serif justify-end align-bottom">In stoc ~|</span>}
                            {!product.inStock && <span className="flex font-serif justify-end align-bottom">Stoc epuizat ~|</span>}
                            <span className="flex font-serif align-bottom">~ COD-{ product.id }</span>

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
                                    addForm.setValues({ price:product.price_category.premium.price, category: 'premium'})
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
                                    addForm.setValues({ price:product.price_category.premium.price, category: 'standard'})
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
                                    addForm.setValues({price: product.price_category.premium.price, category: 'basic'})
                                )}
                            > PREMIUM </Button>
                        </div>
                        <div className='my-3'>
                            <p> FLORI PRINCIPALE </p>
                            <p className='px-5'> 
                                {product.composition
                                    ?.map((flower, idx) => idx < 3 ? (
                                        <span key={idx}>
                                            {flower.title} ,
                                        </span>
                                    ): '')
                                }
                            </p>
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
                                disabled={!product.inStock || addForm.getValues().quantity < 1 ? true : false}
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
                            <p> TIPURI DE FLORI </p>
                            <p className='pb-3 px-4 text-[15px]'> 
                                {product.composition
                                    ?.map((flower, idx) => (
                                        <span key={idx}>
                                            {flower.title} ,
                                        </span>
                                    ))
                                }
                            </p>
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