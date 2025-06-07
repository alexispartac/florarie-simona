'use client';
import React from 'react';
import { usePathname } from "next/navigation";
import { ItemProps, CartItem } from './../../types';
import { NavbarDemo } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import PopUp from '@/app/components/PopUp';
import { Bread } from '@/app/components/Products';
import { Anchor, Button, NumberInput, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Delivery } from '@/app/components/Content';
import { Item } from '@/app/components/Products';
import axios from 'axios';
import { useProductsGroupedByCategory } from '@/app/components/hooks/fetchProductsGroupedByCategory';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, RootState, setCart } from '@/app/cart/components/CartRedux';
import ReviewForm from '../../components/ReviewForm'
import Reviews from '@/app/components/Reviews';

const URL_COMPOSED_PRODUCTS = '/api/products-composed';
const URL_REVIEW = '/api/review';

const Product = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const [product, setProduct] = React.useState<ItemProps | null>(null);
    const [loading, setLoading] = React.useState(true); // Stare pentru încărcare
    const [activeButton, setActiveButton] = React.useState({
        button1: true,
        button2: false,
        button3: false,
    });

    const { data: categoryproducts, isLoading, isError } = useProductsGroupedByCategory();

    const addForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: product?.id ?? '',
            title: product?.title ?? '',
            category: 'basic',
            price: product?.price_category.basic.price,
            quantity: 0,
            image: product?.imageSrc,
        },
        transformValues: (values) => ({
            id: `${values.id}`,
            title: `${values.title}`,
            category: `${values.category}`,
            price: values.price ?? 0,
            quantity: values.quantity,
            image: values.image,
        })
    });

    React.useEffect(() => {
        if (lastSegment) {
            setLoading(true);
            axios.get(`${URL_COMPOSED_PRODUCTS}/${lastSegment}`)
                .then(response => {
                    const data = response.data as ItemProps;
                    setProduct(data);
                    addForm.setValues({
                        id: data.id,
                        title: data.title,
                        category: 'basic',
                        price: data.price_category.basic.price,
                        quantity: 0,
                        image: data.imageSrc,
                    });
                })
                .catch(error => {
                    console.error("Error fetching product:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [lastSegment]);

    const dispatch = useDispatch();
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                const items = JSON.parse(savedCart);
                dispatch(setCart(items));
            }
        }
    }, [dispatch]);

    const handleAddToCart = () => {
        const values = addForm.getValues();
        const itemForCart: CartItem = {
            id: values.id,
            title: values.title,
            category: values.category,
            price: values.price ?? 0,
            quantity: values.quantity,
            image: product?.imageSrc ?? '',
        };
        dispatch(addItem(itemForCart));
    };

    const handleSubmitedReview = async (values: { name: string; email: string; message: string }) => {
        try {
            const response = await axios.post(URL_REVIEW, values);
            if (response.status === 200) {
                console.log('Review submitted successfully:', response.data);
            } else {
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Produsul nu a fost găsit.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" size="lg" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>A apărut o eroare la încărcarea produselor.</p>
            </div>
        );
    }

    const handleSetCategory = ({ button1, button2, button3 }: { button1: boolean, button2: boolean, button3: boolean }) => {
        setActiveButton({
            button1: button1,
            button2: button2,
            button3: button3,
        });
    };

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/' },
        { title: `${product.title}`, href: `/product/${product.id}` },
    ].map((item, index) => (
        <Anchor c={"#b756a6"} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    const isInCart = cartItems.some((cartItem) => cartItem.id === product?.id);

    const itemsRe: ItemProps[] = (Object.values(categoryproducts)
        .flat() as ItemProps[])
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    return (
        <div>
            <PopUp />
            <NavbarDemo>
                <br /><br /><br />
                <div className='mx-8 md:mx-30'>
                    <Bread itemsBread={itemsBread} />
                </div>
                <div className="relative mx-8 md:mx-40 grid md:grid-cols-2 grid-cols-1 my-10">
                    {product.imageSrc &&
                        <img
                            src={product.imageSrc}
                            alt={product.title}
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
                        />
                    }
                    <form
                        className='flex flex-col md:px-8 py-8'
                        onSubmit={addForm.onSubmit(() => handleAddToCart())}
                    >
                        {product.isPopular && <span className="text-red-600 font-serif py-4">Popular</span>}
                        <div className='grid grid-cols-3'>
                            {activeButton.button1 ? <p className="text-2xl font-semibold text-shadow-black">{product.price_category.basic.price} RON</p> : null}
                            {activeButton.button2 ? <p className="text-2xl font-semibold text-shadow-black">{product.price_category.standard.price} RON</p> : null}
                            {activeButton.button3 ? <p className="text-2xl font-semibold text-shadow-black">{product.price_category.premium.price} RON</p> : null}
                            {product.inStock && <span className="flex font-serif justify-end align-bottom">In stoc ~|</span>}
                            {!product.inStock && <span className="flex font-serif justify-end align-bottom">Stoc epuizat ~|</span>}
                            <span className="flex font-serif align-bottom">~ COD-{product.id.substring(0, 8)}</span>
                        </div>
                        <h2 className="text-3xl font-thin my-2">{product.title}</h2>
                        <div className='grid grid-cols-3 gap-1.5 my-5'>
                            <Button
                                bg={activeButton.button1 ? '#b756a64f' : 'white'}
                                disabled={activeButton.button1}
                                color={'#b756a64f'}
                                variant='outline'
                                key={addForm.key('category1')}
                                size='compact-sm'
                                onClick={() => (
                                    handleSetCategory({ button1: true, button2: false, button3: false }),
                                    addForm.setValues({ price: product.price_category.basic.price, category: 'basic' })
                                )}
                            > BASIC </Button>
                            <Button
                                bg={activeButton.button2 ? '#b756a64f' : 'white'}
                                disabled={activeButton.button2}
                                color={'#b756a64f'}
                                variant='outline'
                                size='compact-sm'
                                key={addForm.key('category2')}
                                onClick={() => (
                                    handleSetCategory({ button1: false, button2: true, button3: false }),
                                    addForm.setValues({ price: product.price_category.standard.price, category: 'standard' })
                                )}
                            > STANDARD </Button>
                            <Button
                                bg={activeButton.button3 ? '#b756a64f' : 'white'}
                                disabled={activeButton.button3}
                                color={'#b756a64f'}
                                variant='outline'
                                size='compact-sm'
                                key={addForm.key('category3')}
                                onClick={() => (
                                    handleSetCategory({ button1: false, button2: false, button3: true }),
                                    addForm.setValues({ price: product.price_category.premium.price, category: 'premium' })
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
                                    ) : '')
                                }
                            </p>
                        </div>
                        <div className='mb-3'>
                            <p> CULOARE PREDOMINANTA </p>
                            <p className='px-5'> {product.colors?.substring(0, product.colors?.indexOf(','))} </p>
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
                                disabled={!product.inStock || isInCart || addForm.getValues().quantity < 1 ? true : false}
                                onClick={() => {
                                    addForm.setValues({ image: product?.imageSrc });
                                }}
                            >
                                {isInCart ? 'În coș' : product.inStock ? 'Adaugă în coș' : 'Indisponibil'}
                            </Button>
                        </div>
                        <div className='grid grid-cols-2 mt-4'>
                            <p className='flex justify-end'> <a href=""> Cum comanzi ~ </a></p>
                            <p className='flex justify-start'> <a href="">|~ Cum livram </a></p>
                        </div>
                    </form>
                </div>
                {/* detalii */}
                <div className="relative mx-8 md:mx-40 my-10" >
                    <div className='my-5'>
                        <p className='text-xl text-center my-3'> DETALII </p>
                        <p> {product.description} </p>
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
                            <p className='pb-3 px-4 text-[15px]'> {product.colors} </p>
                        </div>
                        <div className='my-2'>
                            <p> TIP DE PRODUS </p>
                            <p className='pb-3 px-4 text-[15px]'> {product.category} </p>
                        </div>
                        <div className='my-2'>
                            <p> COD PRODUS </p>
                            <p className='pb-3 px-4 text-[15px]'> {product.id} </p>
                        </div>
                    </div>
                </div>
                {/* recenzie */}
                <ReviewForm
                    productTitle={product.title}
                    onSubmit={handleSubmitedReview}
                />
                <Reviews product={`${lastSegment}`} />
                {/* recomandari */}
                <div className="relative mx-8 md:mx-40 my-20">
                    <p className='text-center'>PRODUSE RECOMANDATE</p>
                    <div className='grid xl:grid-cols-4 grid-cols-2 gap-4 xl:mx-22 xl:gap-8 my-6'>
                        {itemsRe.map(
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
    );
};

export default Product;