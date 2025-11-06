'use client';
import { useProductsGroupedByCategory } from '@/app/components/hooks/fetchProductsGroupedByCategory';
import { addItem, RootState, setCart } from '@/app/cart/components/CartRedux';
import { Anchor, Button, NumberInput, Loader, Modal } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { Delivery } from '@/app/components/Content';
import { ComposedProductProps } from '@/app/types/products';
import { CartItem } from '@/app/types/cart';
import { Bread } from '@/app/components/Products';
import { Footer } from '../../components/Footer';
import { Item } from '@/app/components/Products';
import { usePathname } from "next/navigation";
import PopUp from '@/app/components/PopUp';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import React from 'react';
import ProductImages from '@/app/components/GalleryForShowImages';

const URL_COMPOSED_PRODUCTS = '/api/products-composed';
const URL_CHECK_COMPOSITION = '/api/check-composition';

const Product = () => {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const pathname = usePathname();
    const lastSegment = pathname.split("/").pop();
    const [product, setProduct] = React.useState<ComposedProductProps | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [modalOpened, setModalOpened] = React.useState(false);
    const [modalMessage, setModalMessage] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);
    const { data: categoryproducts, isLoading, isError } = useProductsGroupedByCategory();
    const [inStock, setInStock] = React.useState(true);
    const router = useRouter();

    const addForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            id: product?.id ?? '',
            title: product?.title ?? '',
            category: 'standard',
            price: product?.info_category.standard.price,
            quantity: 0,
            image: product?.info_category.standard.imageSrc ?? '',
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
                    const data = response.data as ComposedProductProps;
                    setProduct(data);
                    addForm.setValues({
                        id: data.id,
                        title: data.title,
                        category: 'standard',
                        price: data.info_category.standard.price,
                        quantity: 0,
                        image: data.info_category.standard.imageSrc,
                    });
                    setInStock(product?.inStock ?? true);
                    axios.post(URL_CHECK_COMPOSITION, [{
                        id: data.id,
                        title: data.title,
                        price: data.info_category.standard.price,
                        category: data.category,
                        composition: data.info_category.standard.composition,
                        quantity: 1,
                        imageSrc: data.info_category.standard.imageSrc
                    }]).then(response => {
                        if (response.status !== 200) {
                            setModalMessage('Produsul nu mai este disponibil sau nu are suficiente cantități în stoc.');
                            setModalOpened(true);
                        } else {
                            console.log('response:', response);
                        }
                    }).catch(error => {
                        console.log('Eroare la verificarea stocului:', error);
                        setModalMessage('Produsul nu mai este disponibil, te rugăm să încerci altul pana la următoarea reaprovizionare.');
                        setInStock(false);
                        setModalOpened(true);
                    });
                })
                .catch(error => {
                    console.log("Error fetching product:", error);
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
        const category = values.category as 'standard';

        try {
            setIsAdding(true);
            if (!product) {
                setModalMessage('Produsul nu mai este in stoc!');
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
                router.push('/cart');
                
            } else if (response.status === 201) {
                setModalMessage(`Cantitatea necesară nu este disponibilă va rugam să reveniti urmatoarele zile.`);
            }
        } catch (error) {
            console.log('Eroare la verificarea cantității:', error);
            setModalMessage('Cantitatea necesară nu este disponibilă, va rugam să reveniti urmatoarele zile.');
        } finally {
            setIsAdding(false);
            setModalOpened(true);
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

    const itemsBread = [
        { title: 'Buchetul Simonei', href: '/homepage' },
        { title: `${product.title}`, href: `/product/${product.id}` },
    ].map((item, index) => (
        <Anchor c={"#b756a6"} href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    const isInCart = cartItems.some((cartItem) => cartItem.id === product?.id);

    const itemsRe: ComposedProductProps[] = (Object.values(categoryproducts)
        .flat() as ComposedProductProps[])
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    return (
        <div>
            <PopUp />
            <div className='mx-8 mt-28 md:mx-30'>
                <Bread itemsBread={itemsBread} />
            </div>
            <div className="relative mx-8 md:mx-40 grid md:grid-cols-2 grid-cols-1 my-10">
                {/* galerie imagini */}
                <ProductImages folderName={product.id} />
                <form
                    className='flex flex-col md:px-8 py-8'
                    onSubmit={addForm.onSubmit(() => handleAddToCart())}
                >
                    {product.isPopular && <span className="text-red-600 font-serif font-bold py-2">Popular</span>}
                    {inStock ? <p className="font-semibold">In stoc</p> : <p className="text-red-600 font-semibold">Nu este in stoc</p>}
                    <h2 className="text-3xl font-thin my-2">{product.title}</h2>
                    <div className='flex'>
                        <div>
                            {product.promotion && product.discountPercentage ? (
                                <>
                                    <span className="text-gray-400 line-through mr-2 text-lg">
                                        {(product.info_category.standard.price * (1 + product.discountPercentage / 100)).toFixed(2)} RON
                                    </span>
                                    <span className="text-red-600 font-semibold text-2xl">
                                        {product.info_category.standard.price.toFixed(2)} RON
                                    </span>
                                </>
                            ) : (
                                <p className="text-2xl font-semibold text-shadow-black">
                                    {product.info_category.standard.price.toFixed(2)} RON
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='my-3'>
                        <p> COMPOZIȚIE </p>
                        <div className='px-5'>
                            {product.info_category.standard.composition.map((item, idx) => (
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
                        <Button
                            className='w-full'
                            variant='fill'
                            w={300}
                            bg={'#b756a6'}
                            type='submit'
                            disabled={!product.inStock || !inStock || isInCart || addForm.getValues().quantity < 1}
                            onClick={() => {
                                const category = addForm.getValues().category as 'standard';
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
                            {product.info_category.standard.composition.map((_, idx) => (
                                    <p key={idx}>
                                        {product.info_category.standard.composition[idx].title} - Cantitate: {product.info_category.standard.composition[idx].quantity}
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
            {/* recomandari */}
            <div className="relative mx-8 md:mx-40 my-20">
                <p className='text-center'>PRODUSE RECOMANDATE</p>
                <div className='grid xl:grid-cols-4 grid-cols-2 gap-4 xl:mx-22 xl:gap-8 my-6'>
                    {itemsRe.map(
                        (item: ComposedProductProps, idx: number) => (
                            item.id !== product.id && (
                                <Item item={item} key={idx} />
                            )
                        )
                    )}
                </div>
            </div>
            <Delivery />
            <Footer />
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                centered
                title="Informație"
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
};

export default Product;