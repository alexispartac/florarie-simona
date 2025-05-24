'use client';
import React, { useEffect, useState } from 'react';
import { SidebarDemo } from '../components/SideBar';
import { Modal, Button, TextInput, NumberInput, Checkbox, Group, Select, Textarea, MultiSelect } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import type { ComposedProductProps, ProductProps } from '../types';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import axios from 'axios';

const URL_SIMPLE_PRODUCTS = 'http://localhost:3000/api/products';
const URL_COMPOSED_PRODUCTS = 'http://localhost:3000/api/products-composed';
const URL_COMPOSED_CATEGORIES = 'http://localhost:3000/api/products-composed-categories';

if (typeof window !== 'undefined') {
  const resizeObserverErrorHandler = () => {
    console.warn('ResizeObserver loop limit exceeded');
  };
  window.addEventListener('error', (e) => {
    if (e.message === 'ResizeObserver loop limit exceeded') {
      e.stopImmediatePropagation();
      resizeObserverErrorHandler();
    }
  });
}

const ComposedProductRow = ({
    product,
    onEdit,
    onDelete
}: {
    product: ComposedProductProps,
    onEdit: (product: ComposedProductProps) => void,
    onDelete: (id: string) => void
}) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <>
            {/* Modal de confirmare ștergere */}
            <Modal
                opened={confirmDelete}
                onClose={() => setConfirmDelete(false)}
                title="Confirmă ștergerea"
                centered
                withCloseButton={false}
            >
                <div className="flex flex-col gap-4">
                    <p>Ești sigur că vrei să ștergi produsul <b>{product.title}</b>?</p>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => setConfirmDelete(false)}>
                            Anulează
                        </Button>
                        <Button color="red" onClick={() => { onDelete(product.id); setConfirmDelete(false); }}>
                            Șterge
                        </Button>
                    </Group>
                </div>
            </Modal>
            <div className="flex flex-row justify-between gap-2 items-center border-b py-2">
                <div className="w-1/10">
                    {product.imageSrc ? (
                        <img src={product.imageSrc} alt={product.title} className="w-16 h-16 object-cover rounded" />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Fără imagine</div>
                    )}
                </div>
                <h2 className="w-1/10">{product.title}</h2>
                <p className="w-1/10">{product.stockCode}</p>
                <p className="w-1/10">{product.inStock ? "Da" : "Nu"}</p>
                <p className="w-1/10">{product.category}</p>
                <p className="w-1/10">{product.price_category.standard.price} RON</p>
                <p className="w-1/10">{product.price_category.premium.price} RON</p>
                <p className="w-1/10">{product.price_category.basic.price} RON</p>
                <p className="w-1/10">{product.isPopular ? "⭐" : ""}</p>
                <p className="w-1/10">{product.promotion ? "⭐" : ""}</p>
                <div className="w-1/10 flex gap-2">
                    <Button color="blue" variant="outline" onClick={() => onEdit(product)}>
                        <IconEdit size={16} />
                    </Button>
                    <Button color="red" variant="outline" onClick={() => setConfirmDelete(true)}>
                        <IconTrash size={16} />
                    </Button>
                </div>
            </div>
        </>
    );
};

const EditComposedProductModal = ({
    opened,
    onClose,
    product,
    onSave,
    composedCategories,
    simpleProducts
}: {
    opened: boolean;
    onClose: () => void;
    product: ComposedProductProps | null;
    onSave: (updated: ComposedProductProps) => void;
    composedCategories: string[];
    simpleProducts: ProductProps[];
}) => {
    const [editProduct, setEditProduct] = useState<ComposedProductProps | null>(product);

    useEffect(() => {
        setEditProduct(product);
    }, [product]);

    if (!editProduct) return null;

    const handleChange = (field: keyof ComposedProductProps, value: unknown) => {
        setEditProduct((prev) => prev ? { ...prev, [field]: value } : prev);
    };

    const handlePriceCategoryChange = (cat: 'standard' | 'premium' | 'basic', value: number) => {
        setEditProduct((prev) =>
            prev
                ? {
                    ...prev,
                    price_category: {
                        ...prev.price_category,
                        [cat]: { price: value }
                    }
                }
                : prev
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                handleChange('imageSrc', ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editProduct) {
            onSave(editProduct);
            onClose();
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Editează produs compus" fullScreen>
            <form className="flex flex-col gap-4 max-w-md mx-auto mt-10" onSubmit={handleSubmit}>
                <TextInput
                    label="Denumire"
                    value={editProduct.title}
                    onChange={e => handleChange('title', e.currentTarget.value)}
                    required
                />
                <TextInput
                    label="Cod stoc"
                    value={editProduct.stockCode}
                    onChange={e => handleChange('stockCode', e.currentTarget.value)}
                    required
                />
                <Checkbox
                    label="În stoc"
                    checked={editProduct.inStock}
                    onChange={e => handleChange('inStock', e.currentTarget.checked)}
                />
                <Select
                    label="Categorie"
                    data={composedCategories}
                    value={editProduct.category}
                    onChange={value => handleChange('category', value || composedCategories[0])}
                    required
                />
                <Textarea
                    label="Descriere"
                    value={editProduct.description}
                    onChange={e => handleChange('description', e.currentTarget.value)}
                />
                <MultiSelect
                    label="Compoziție"
                    data={simpleProducts.map(p => ({ value: p.id, label: p.title }))}
                    value={editProduct.composition.map((p: ProductProps) => p.id)}
                    onChange={ids => {
                        // Caută produsele simple selectate după id și setează ca array de ProductProps
                        const selected = simpleProducts.filter(p => ids.includes(p.id));
                        handleChange('composition', selected);
                    }}
                    searchable
                    nothingFoundMessage="Niciun produs găsit"
                    placeholder="Alege produsele componente"
                />
                <TextInput
                    label="Culori"
                    value={editProduct.colors}
                    onChange={e => handleChange('colors', e.currentTarget.value)}
                />
                <Checkbox
                    label="Popular"
                    checked={editProduct.isPopular}
                    onChange={e => handleChange('isPopular', e.currentTarget.checked)}
                />
                <Checkbox
                    label="Promoție"
                    checked={editProduct.promotion}
                    onChange={e => handleChange('promotion', e.currentTarget.checked)}
                />
                <div>
                    <label className="block mb-1 font-medium">Imagine produs</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block cursor-pointer w-full text-sm text-gray-500 border border-gray-300 rounded focus:outline-none focus:ring ring-blue-500"
                    />
                    {editProduct.imageSrc && (
                        <img
                            src={editProduct.imageSrc}
                            alt="Preview"
                            className="mt-2 w-32 h-32 object-cover rounded border"
                        />
                    )}
                    {editProduct.imageSrc && (
                        <Button
                            variant="outline"
                            color="red"
                            onClick={() => handleChange('imageSrc', '')}
                            className="mt-2"
                        >
                            Șterge imaginea
                        </Button>
                    )}
                </div>
                <Group>
                    <NumberInput
                        label="Preț standard"
                        value={editProduct.price_category.standard.price}
                        onChange={value => handlePriceCategoryChange('standard', typeof value === 'number' ? value : Number(value) || 0)}
                        required
                        min={0}
                        step={1}
                    />
                    <NumberInput
                        label="Preț premium"
                        value={editProduct.price_category.premium.price}
                        onChange={value => handlePriceCategoryChange('premium', typeof value === 'number' ? value : Number(value) || 0)}
                        required
                        min={0}
                        step={1}
                    />
                    <NumberInput
                        label="Preț basic"
                        value={editProduct.price_category.basic.price}
                        onChange={value => handlePriceCategoryChange('basic', typeof value === 'number' ? value : Number(value) || 0)}
                        required
                        min={0}
                        step={1}
                    />
                </Group>
                <Group justify="flex-end">
                    <Button variant="default" onClick={onClose}>Anulează</Button>
                    <Button type="submit" color="blue">Salvează</Button>
                </Group>
            </form>
        </Modal>
    );
};

const ListOfProducts = ({
    products,
    composedCategories,
    simpleProducts
}: {
    products: ComposedProductProps[];
    composedCategories: string[];
    simpleProducts: ProductProps[];
}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(composedCategories[0]);
    const [allProducts, setAllProducts] = useState<ComposedProductProps[]>(products);
    const [newProduct, setNewProduct] = useState<ComposedProductProps>({
        id: uuidv4(),
        title: '',
        imageSrc: '',
        price_category: {
            standard: { price: 0 },
            premium: { price: 0 },
            basic: { price: 0 },
        },
        isPopular: false,
        stockCode: '',
        inStock: false,
        description: '',
        composition: [],
        colors: '',
        category: composedCategories[0],
        promotion: false,
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ComposedProductProps | null>(null);

    React.useEffect(() => {
        setAllProducts(products);
    }, [products]);

    const handleNewProductChange = (field: keyof ComposedProductProps, value: unknown) => {
        setNewProduct((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const productToAdd = { ...newProduct, id: uuidv4() };
        try {
            await axios.post(URL_COMPOSED_PRODUCTS, productToAdd);
            setAllProducts((prev) => [...prev, productToAdd]);
            setNewProduct({
                id: uuidv4(),
                title: '',
                imageSrc: '',
                price_category: {
                    standard: { price: 0 },
                    premium: { price: 0 },
                    basic: { price: 0 },
                },
                isPopular: false,
                stockCode: '',
                inStock: false,
                description: '',
                composition: [],
                colors: '',
                category: composedCategories[0],
                promotion: false,
            });
            close();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEdit = (product: ComposedProductProps) => {
        setEditProduct(product);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (updated: ComposedProductProps) => {
        try {
            await axios.put(URL_COMPOSED_PRODUCTS, updated);
            setAllProducts((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
            );
            setEditModalOpen(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = (id: string) => {
        axios
            .delete(URL_COMPOSED_PRODUCTS, { data: { id } })
            .then(() => {
                setAllProducts((prev) => prev.filter((p) => p.id !== id));
                alert('Produs șters cu succes!');
            })
            .catch((error) => {
                console.error('Error deleting product:', error);
            });
    };

    return (
        <div className="flex flex-col gap-2 my-2">
            <div className="flex flex-row justify-between gap-2">
                <Button variant="outline" color="blue" onClick={open}>
                    Adaugă produs
                </Button>
                <Modal
                    opened={opened}
                    onClose={close}
                    title="Adaugă produs"
                    fullScreen={true}
                >
                    <form
                        className="flex flex-col gap-4 max-w-md mx-auto mt-10"
                        onSubmit={handleAddProduct}
                    >
                        <TextInput
                            label="Denumire"
                            value={newProduct.title}
                            onChange={e => handleNewProductChange('title', e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label="Cod stoc"
                            value={newProduct.stockCode}
                            onChange={e => handleNewProductChange('stockCode', e.currentTarget.value)}
                            required
                        />
                        <Checkbox
                            label="În stoc"
                            checked={newProduct.inStock}
                            onChange={e => handleNewProductChange('inStock', e.currentTarget.checked)}
                        />
                        <Select
                            label="Categorie"
                            data={composedCategories}
                            value={newProduct.category}
                            onChange={value => handleNewProductChange('category', value || composedCategories[0])}
                            required
                        />
                        <Textarea
                            label="Descriere"
                            value={newProduct.description}
                            onChange={e => handleNewProductChange('description', e.currentTarget.value)}
                        />
                        <MultiSelect
                            label="Compoziție"
                            data={simpleProducts.map(p => ({ value: p.id, label: p.title }))}
                            value={newProduct.composition.map((p: ProductProps) => p.id)}
                            onChange={ids => {
                                const selected = simpleProducts.filter(p => ids.includes(p.id));
                                handleNewProductChange('composition', selected);
                            }}
                            searchable
                            nothingFoundMessage="Niciun produs găsit"
                            placeholder="Alege produsele componente"
                        />
                        <TextInput
                            label="Culori"
                            value={newProduct.colors}
                            onChange={e => handleNewProductChange('colors', e.currentTarget.value)}
                        />
                        <Checkbox
                            label="Popular"
                            checked={newProduct.isPopular}
                            onChange={e => handleNewProductChange('isPopular', e.currentTarget.checked)}
                        />
                        <Checkbox
                            label="Promoție"
                            checked={newProduct.promotion}
                            onChange={e => handleNewProductChange('promotion', e.currentTarget.checked)}
                        />
                        <div>
                            <label className="block mb-1 font-medium">Imagine produs</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            handleNewProductChange('imageSrc', ev.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block cursor-pointer w-full text-sm text-gray-500 border border-gray-300 rounded focus:outline-none focus:ring ring-blue-500"
                            />
                            {newProduct.imageSrc && (
                                <img
                                    src={newProduct.imageSrc}
                                    alt="Preview"
                                    className="mt-2 w-32 h-32 object-cover rounded border"
                                />
                            )}
                        </div>
                        <Group>
                            <NumberInput
                                label="Preț standard"
                                value={newProduct.price_category.standard.price}
                                onChange={value => handleNewProductChange('price_category', { ...newProduct.price_category, standard: { price: value ?? 0 }, premium: newProduct.price_category.premium, basic: newProduct.price_category.basic })}
                                required
                                min={0}
                                step={1}
                            />
                            <NumberInput
                                label="Preț premium"
                                value={newProduct.price_category.premium.price}
                                onChange={value => handleNewProductChange('price_category', { ...newProduct.price_category, premium: { price: value ?? 0 }, standard: newProduct.price_category.standard, basic: newProduct.price_category.basic })}
                                required
                                min={0}
                                step={1}
                            />
                            <NumberInput
                                label="Preț basic"
                                value={newProduct.price_category.basic.price}
                                onChange={value => handleNewProductChange('price_category', { ...newProduct.price_category, basic: { price: value ?? 0 }, standard: newProduct.price_category.standard, premium: newProduct.price_category.premium })}
                                required
                                min={0}
                                step={1}
                            />
                        </Group>
                        <Group justify="flex-end">
                            <Button variant="default" onClick={close}>Anulează</Button>
                            <Button type="submit" color="blue">Adaugă</Button>
                        </Group>
                    </form>
                </Modal>
                <EditComposedProductModal
                    opened={editModalOpen}
                    simpleProducts={simpleProducts}
                    onClose={() => setEditModalOpen(false)}
                    product={editProduct}
                    onSave={handleSaveEdit}
                    composedCategories={composedCategories}
                />
            </div>
            <Select
                label="Alege o categorie"
                data={composedCategories}
                value={selectedCategory}
                defaultValue={selectedCategory}
                onChange={setSelectedCategory}
                allowDeselect={false}
                classNames={{
                    input: 'bg-neutral-800 text-white',
                }}
            />
            <div className="flex flex-col gap-2 my-2">
                <div className="flex flex-row justify-between gap-2">
                    <span className="w-1/10">IMAGINE</span>
                    <span className="w-1/10">DENUMIRE</span>
                    <span className="w-1/10">COD STOC</span>
                    <span className="w-1/10">IN STOC</span>
                    <span className="w-1/10">CATEGORIE</span>
                    <span className="w-1/10">STANDARD</span>
                    <span className="w-1/10">PREMIUM</span>
                    <span className="w-1/10">BASIC</span>
                    <span className="w-1/10">POPULAR</span>
                    <span className="w-1/10">PROMO</span>
                    <span className="w-1/10">ACTUALIZARE</span>
                </div>
                <div className="h-1 border-b border-neutral-200 dark:border-neutral-700" />
                <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-400px)]">
                    {allProducts
                        .filter(
                            (product) =>
                                !selectedCategory || product.category === selectedCategory
                        )
                        .map((product) => (
                            <div key={product.id} className="flex flex-col gap-2">
                                <ComposedProductRow
                                    product={product}
                                    onEdit={handleEdit}
                                    onDelete={handleDeleteProduct}
                                />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const CategoryModal = ({
    opened,
    onClose,
    onAddCategory,
}: {
    opened: boolean;
    onClose: () => void;
    onAddCategory: (category: string) => void;
}) => {
    const [categoryName, setCategoryName] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validPrefixes = ['Buchet', 'Aranjament', 'Ocazii', 'Cadouri'];
        const validLinks = ['bouquets', 'arrangements', 'occasion&events', 'gifts'];
        const isValid = validPrefixes.some((prefix) =>
            categoryName.startsWith(prefix)
        );

        const isValidLink = validLinks.includes(link);

        if(!isValidLink){
            alert(
                `Link-ul trebuie să fie una dintre următoarele: ${validLinks.join(
                    ', '
                )}`
            );
            return;
        }

        if (!isValid) {
            alert(
                `Numele categoriei trebuie să înceapă cu unul dintre următoarele cuvinte: ${validPrefixes.join(
                    ', '
                )}`
            );
            return;
        }

        try {
            axios.post(URL_COMPOSED_CATEGORIES, { name: categoryName, link: link });
        } catch (error) {
            console.error('Error adding category:', error);
            alert('A apărut o eroare la adăugarea categoriei. Te rugăm să încerci din nou.');
            return;
        }

        onAddCategory(categoryName);
        setCategoryName('');
        onClose();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Adaugă categorie nouă" centered>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <TextInput
                    label="Nume categorie"
                    placeholder="Ex: Buchet de flori"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.currentTarget.value)}
                    required
                />
                <TextInput
                    label="Link"
                    placeholder="Ex: bouquets | arrangements | occasion&events | gifts"
                    value={link}
                    onChange={(e) => setLink(e.currentTarget.value)}
                    required
                />
                <p className="text-sm text-gray-500">
                    Numele categoriei trebuie să înceapă cu unul dintre următoarele cuvinte: Buchet, Aranjament, Ocazii, Cadouri.
                </p>
                <p className="text-sm text-gray-500">
                    Asigură-te că numele( NU MAI SUNT ALTE CATEGORII CU ACEST NUME) este unic și descriptiv pentru a ajuta la organizarea produselor.
                </p>
                <p className="text-sm text-gray-500">
                    Link-ul este folosit pentru a crea un link către categoria respectivă.
                </p>
                <Group justify="flex-end">
                    <Button variant="default" onClick={onClose}>
                        Anulează
                    </Button>
                    <Button type="submit" color="blue">
                        Adaugă
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

const Page = () => {
    const [products, setProducts] = useState<ComposedProductProps[]>([]);
    const [simpleProducts, setSimpleProducts] = useState<ProductProps[]>([]);
    const [categoryModalOpen, { open: openCategoryModal, close: closeCategoryModal }] = useDisclosure(false);
    const [composedCategories, setComposedCategories] = useState<string[]>([]);

    const fetchComposedCategories = () => {
        try {
            axios.get(URL_COMPOSED_CATEGORIES).then((response) => {
                setComposedCategories(response.data.map((cat: { name: string }) => cat.name));
            });
        } catch (error) {
            console.error('Error fetching composed categories:', error);
        }
    };

    function fetchSimpleProducts() {
        try {
            axios.get(URL_SIMPLE_PRODUCTS).then((response) => {
                setSimpleProducts(response.data);
            });
        } catch (error) {
            console.error('Error fetching simple products:', error);
        }
    }

    function fetchProducts() {
        try {
            axios.get(URL_COMPOSED_PRODUCTS).then((response) => {
                setProducts(response.data);
            });
        } catch (error) {
            console.error('Error fetching composed products:', error);
        }
    }

    const handleAddCategory = (category: string) => {
        setComposedCategories((prev) => [...prev, category]);
        alert(`Categoria "${category}" a fost adăugată cu succes!`);
    };

    useEffect(() => {
        fetchSimpleProducts();
        fetchProducts();
        fetchComposedCategories();
    }, []);

    return (
        <SidebarDemo>
            <div className="flex flex-1">
                <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex gap-2">
                        <div
                            className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
                        >
                            <h1>STOC ȘI PRODUSE COMPUSE</h1>
                        </div>
                    </div>
                    <div className="flex justify-start mt-4">
                        <Button color="blue" onClick={openCategoryModal}>
                            Adaugă categorie
                        </Button>
                    </div>
                    <CategoryModal
                        opened={categoryModalOpen}
                        onClose={closeCategoryModal}
                        onAddCategory={handleAddCategory}
                    />
                    <ListOfProducts
                        simpleProducts={simpleProducts}
                        products={products}
                        composedCategories={composedCategories}
                    />
                </div>
            </div>
        </SidebarDemo>
    );
};

export default Page;