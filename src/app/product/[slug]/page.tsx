'use client';
import { useProductsGroupedByCategory } from '@/app/components/hooks/fetchProductsGroupedByCategory';
import { addItem, RootState, setCart } from '@/app/cart/components/CartRedux';
import { Anchor, Button, NumberInput, Loader, Modal } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import ReviewForm from '../../components/ReviewForm';
import { Delivery } from '@/app/components/Content';
import { ItemProps, CartItem } from './../../types';
import { Bread } from '@/app/components/Products';
import { Footer } from '../../components/Footer';
import { Item } from '@/app/components/Products';
import Reviews from '@/app/components/Reviews';
import { usePathname } from "next/navigation";
import PopUp from '@/app/components/PopUp';
import { useForm } from '@mantine/form';
import axios from 'axios';
import React from 'react';

const URL_COMPOSED_PRODUCTS = '/api/products-composed';
const URL_REVIEW = '/api/review';
const URL_CHECK_COMPOSITION = '/api/check-composition';

const Product = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const [product, setProduct] = React.useState<ItemProps | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [activeButton, setActiveButton] = React.useState({
        button1: true,
        button2: false,
        button3: false,
    });
    const [modalOpened, setModalOpened] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const { data: categoryproducts, isLoading, isError } = useProductsGroupedByCategory();

    const addForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: product?.id ?? '',
            title: product?.title ?? '',
            category: 'basic',
            price: product?.info_category.basic.price,
            quantity: 0,
            image: product?.info_category.basic.imageSrc ?? '',
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
                        price: data.info_category.basic.price,
                        quantity: 0,
                        image: data.info_category.basic.imageSrc,
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

    const handleAddToCart = async () => {
        const values = addForm.getValues();
        const category = values.category as 'basic' | 'standard' | 'premium';

        try {
            setIsAdding(true);
            if (!product) {
                setModalMessage('Produsul nu a fost găsit.');
                setModalOpened(true);
                return;
            }
            const itemForCart: CartItem = {
                id: values.id,
                title: values.title,
                category: values.category,
                price: values.price ?? 0,
                quantity: values.quantity,
                composition: product.info_category[category].composition,
                image: values.image || '',
            };
            // Trimite cererea către backend pentru verificarea cantității
            const response = await axios.post(URL_CHECK_COMPOSITION, [itemForCart]);
            if (response.status === 200) {
                dispatch(addItem(itemForCart));
                setModalMessage('Produsul a fost adăugat în coș!'); 
            } else if (response.status === 201) {;
                setModalMessage(`Cantitatea necesară nu este disponibilă`);
            }
        } catch (error) {
            console.log('Eroare la verificarea cantității:', error);
            setModalMessage('A apărut o eroare. Te rugăm să încerci din nou.');
        } finally {
            setIsAdding(false);
            setModalOpened(true);
        }
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
                <div className='mx-8 md:mx-30'>
                    <Bread itemsBread={itemsBread} />
                </div>
                <div className="relative mx-8 md:mx-40 grid md:grid-cols-2 grid-cols-1 my-10">
                    {/* Afișarea imaginii în funcție de categoria selectată */}
                    {activeButton.button1 && product.info_category.basic.imageSrc && (
                        <img
                            src={product.info_category.basic.imageSrc}
                            alt={`${product.title} - Basic`}
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
                        />
                    )}
                    {activeButton.button2 && product.info_category.standard.imageSrc && (
                        <img
                            src={product.info_category.standard.imageSrc}
                            alt={`${product.title} - Standard`}
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
                        />
                    )}
                    {activeButton.button3 && product.info_category.premium.imageSrc && (
                        <img
                            src={product.info_category.premium.imageSrc}
                            alt={`${product.title} - Premium`}
                            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-md"
                        />
                    )}
                    <form
                        className='flex flex-col md:px-8 py-8'
                        onSubmit={addForm.onSubmit(() => handleAddToCart())}
                    >
                        {product.isPopular && <span className="text-red-600 font-serif py-4">Popular</span>}
                        <div className='grid grid-cols-3'>
                            {activeButton.button1 ? <p className="text-2xl font-semibold text-shadow-black">{product.info_category.basic.price} RON</p> : null}
                            {activeButton.button2 ? <p className="text-2xl font-semibold text-shadow-black">{product.info_category.standard.price} RON</p> : null}
                            {activeButton.button3 ? <p className="text-2xl font-semibold text-shadow-black">{product.info_category.premium.price} RON</p> : null}
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
                                    addForm.setValues({ price: product.info_category.basic.price, category: 'basic' })
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
                                    addForm.setValues({ price: product.info_category.standard.price, category: 'standard' })
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
                                    addForm.setValues({ price: product.info_category.premium.price, category: 'premium' })
                                )}
                            > PREMIUM </Button>
                        </div>
                        <div className='my-3'>
                            <p> COMPOZIȚIE </p>
                            <div className='px-5'>
                                {activeButton.button1 &&
                                    product.info_category.basic.composition.map((item, idx) => (
                                        <p key={idx}>
                                            {item.title} - Cantitate: {item.quantity}
                                        </p>
                                    ))}
                                {activeButton.button2 &&
                                    product.info_category.standard.composition.map((item, idx) => (
                                        <p key={idx}>
                                            {item.title} - Cantitate: {item.quantity}
                                        </p>
                                    ))}
                                {activeButton.button3 &&
                                    product.info_category.premium.composition.map((item, idx) => (
                                        <p key={idx}>
                                            {item.title} - Cantitate: {item.quantity}
                                        </p>
                                    ))}
                            </div>
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
                                disabled={!product.inStock || isInCart || addForm.getValues().quantity < 1}
                                onClick={() => {
                                    const category = addForm.getValues().category as 'basic' | 'standard' | 'premium';
                                    addForm.setValues({ image: product.info_category[category].imageSrc });
                                }}
                            >
                                 {isAdding ? <Loader color="white" size="sm" /> : isInCart ? 'În coș' : 'Adaugă în coș'}
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
                        <div className='my-3'>
                            <p> COMPOZIȚIE </p>
                            <div className='px-5'>
                                {activeButton.button1 &&
                                    product.info_category.basic.composition.map((item, idx) => (
                                        <p key={idx}>
                                            {product.info_category.basic.composition[idx].title} - Cantitate: {product.info_category.basic.composition[idx].quantity}
                                        </p>
                                    ))}
                                {activeButton.button2 &&
                                    product.info_category.standard.composition.map((item, idx) => (
                                        <p key={idx}>
                                            {product.info_category.standard.composition[idx].title} - Cantitate: {product.info_category.standard.composition[idx].quantity}
                                        </p>
                                    ))}
                                {activeButton.button3 &&
                                    product.info_category.premium.composition.map((item, idx) => (
                                        <p key={idx}>
                                            {product.info_category.premium.composition[idx].title} - Cantitate: {product.info_category.premium.composition[idx].quantity}
                                        </p>
                                    ))}
                            </div>
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
            <Delivery />
            <Footer />
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Notificare"
                centered
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
};

export default Product;