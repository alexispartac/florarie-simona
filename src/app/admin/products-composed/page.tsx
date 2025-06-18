'use client';
import {
    Modal,
    Button,
    TextInput,
    NumberInput,
    Checkbox,
    Group,
    Select,
    Textarea,
    MultiSelect,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { SidebarDemo } from '../components/SideBar';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import type { ComposedProductProps, ProductProps } from '../types';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const URL_SIMPLE_PRODUCTS = '/api/products';
const URL_COMPOSED_PRODUCTS = '/api/products-composed';
const URL_COMPOSED_CATEGORIES = '/api/products-composed-categories';

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

// Componentă reutilizabilă pentru gestionarea unei categorii
const CategoryFormSection = ({
    categoryName,
    categoryData,
    onChange,
    simpleProducts,
}: {
    categoryName: string;
    categoryData: {
        price: number;
        imageSrc: string;
        composition: { id: string; title: string; quantity: number }[];
    };
    onChange: (updatedCategory: typeof categoryData) => void;
    simpleProducts: ProductProps[];
}) => {
    return (
        <fieldset className="border border-gray-300 rounded-md p-4 mb-4">
            <legend className="text-lg font-medium px-2">Categorie {categoryName}</legend>

            {/* Imagine */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Imagine</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                                onChange({
                                    ...categoryData,
                                    imageSrc: ev.target?.result as string,
                                });
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="block cursor-pointer w-full text-sm text-gray-500 border border-gray-300 rounded focus:outline-none focus:ring ring-blue-500"
                />
                {categoryData.imageSrc && (
                    <div className="mt-2">
                        <img
                            src={categoryData.imageSrc}
                            alt={`Preview ${categoryName}`}
                            className="w-32 h-32 object-cover rounded border"
                        />
                        <Button
                            variant="outline"
                            color="red"
                            onClick={() =>
                                onChange({
                                    ...categoryData,
                                    imageSrc: '',
                                })
                            }
                            className="mt-2"
                        >
                            Șterge imaginea
                        </Button>
                    </div>
                )}
            </div>

            {/* Compoziție */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Compoziție</label>
                {categoryData.composition.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-4 mb-2">
                        <p className="flex-1">{item.title}</p>
                        <NumberInput
                            label="Cantitate"
                            value={item.quantity}
                            onChange={(value) => {
                                const updatedComposition = [...categoryData.composition];
                                updatedComposition[idx].quantity = Number(value) ?? 0;
                                onChange({
                                    ...categoryData,
                                    composition: updatedComposition,
                                });
                            }}
                            min={0}
                            step={1}
                        />
                    </div>
                ))}
                <MultiSelect
                    label="Adaugă produse componente"
                    data={simpleProducts.map((p) => ({ value: p.id, label: p.title }))}
                    value={categoryData.composition.map((p) => p.id)}
                    onChange={(ids) => {
                        const selected = simpleProducts
                            .filter((p) => ids.includes(p.id))
                            .map((p) => ({ ...p, quantity: 1 })); // Setăm cantitatea implicită la 1
                        onChange({
                            ...categoryData,
                            composition: selected,
                        });
                    }}
                    searchable
                    nothingFoundMessage="Niciun produs găsit"
                    placeholder="Alege produsele componente"
                />
            </div>

            {/* Preț */}
            <div className="mb-4">
                <NumberInput
                    label="Preț"
                    value={categoryData.price}
                    onChange={(value) =>
                        onChange({
                            ...categoryData,
                            price: Number(value) ?? 0,
                        })
                    }
                    required
                    min={0}
                    step={1}
                />
            </div>
        </fieldset>
    );
};

// Componenta pentru a afișa un rând de produs compus
const ComposedProductRow = ({
    product,
    onEdit,
    onDelete,
}: {
    product: ComposedProductProps;
    onEdit: (product: ComposedProductProps) => void;
    onDelete: (id: string) => void;
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
                    <p>
                        Ești sigur că vrei să ștergi produsul <b>{product.title}</b>?
                    </p>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => setConfirmDelete(false)}>
                            Anulează
                        </Button>
                        <Button
                            color="red"
                            onClick={() => {
                                onDelete(product.id);
                                setConfirmDelete(false);
                            }}
                        >
                            Șterge
                        </Button>
                    </Group>
                </div>
            </Modal>
            <div className="flex flex-col sm:flex-row justify-between gap-2 items-center text-center border-b py-2">
                <div className="w-full sm:w-1/10">
                    {product.info_category.standard.imageSrc ? (
                        <img
                            src={product.info_category.standard.imageSrc}
                            alt={product.title}
                            className="w-full h-30 md:h-16 object-cover rounded"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                            Fără imagine
                        </div>
                    )}
                </div>
                <h2 className="w-full sm:w-1/10 text-sm sm:text-base">{product.title}</h2>
                <p className="w-full sm:w-1/10 text-sm">{product.stockCode}</p>
                <p className="w-full sm:w-1/10 text-sm">{product.inStock ? 'Da' : 'Nu'}</p>
                <p className="w-full sm:w-1/10 text-sm">{product.category}</p>
                <p className="w-full sm:w-1/10 text-sm">{product.info_category.premium.price} RON</p>
                <p className="w-full sm:w-1/10 text-sm">{product.info_category.standard.price} RON</p>
                <p className="w-full sm:w-1/10 text-sm">{product.info_category.basic.price} RON</p>
                <p className="w-full sm:w-1/10 text-sm">{product.isPopular ? '⭐' : ''}</p>
                <p className="w-full sm:w-1/10 text-sm">{product.promotion ? '⭐' : ''}</p>
                <p className="w-full sm:w-1/10 text-sm">{product.newest ? '⭐' : ''}</p>
                <div className="w-full sm:w-1/10 flex gap-2 justify-center">
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
    simpleProducts,
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
        if (field === 'info_category') {
            setEditProduct((prev) =>
                prev
                    ? {
                        ...prev,
                        info_category: {
                            ...prev.info_category,
                            ...(value as Partial<typeof prev.info_category>),
                        },
                    }
                    : prev
            );
        } else {
            setEditProduct((prev) => (prev ? { ...prev, [field]: value } : prev));
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
                    onChange={(e) => handleChange('title', e.currentTarget.value)}
                    required
                    autoFocus={false}
                />
                <TextInput
                    label="Cod stoc"
                    value={editProduct.stockCode}
                    onChange={(e) => handleChange('stockCode', e.currentTarget.value)}
                    required
                    autoFocus={false}
                />
                <Checkbox
                    label="În stoc"
                    checked={editProduct.inStock}
                    onChange={(e) => handleChange('inStock', e.currentTarget.checked)}
                />
                <Select
                    label="Categorie"
                    data={composedCategories}
                    value={editProduct.category}
                    onChange={(value) => handleChange('category', value || composedCategories[0])}
                    required
                />
                <Textarea
                    label="Descriere"
                    value={editProduct.description}
                    onChange={(e) => handleChange('description', e.currentTarget.value)}
                />
                <TextInput
                    label="Culori"
                    autoFocus={false}
                    value={editProduct.colors}
                    onChange={(e) => handleChange('colors', e.currentTarget.value)}
                />
                <Checkbox
                    label="Popular"
                    checked={editProduct.isPopular}
                    onChange={(e) => handleChange('isPopular', e.currentTarget.checked)}
                />
                <Checkbox
                    label="Promoție"
                    checked={editProduct.promotion}
                    onChange={(e) => handleChange('promotion', e.currentTarget.checked)}
                />
                <Checkbox
                    label="Nou"
                    checked={editProduct.newest}
                    onChange={(e) => handleChange('newest', e.currentTarget.checked)}
                />
                <div>
                    <CategoryFormSection
                        categoryName="Standard"
                        categoryData={editProduct.info_category.standard}
                        onChange={(updatedCategory) =>
                            handleChange('info_category', {
                                ...editProduct.info_category,
                                standard: updatedCategory,
                            })
                        }
                        simpleProducts={simpleProducts}
                    />
                    <CategoryFormSection
                        categoryName="Premium"
                        categoryData={editProduct.info_category.premium}
                        onChange={(updatedCategory) =>
                            handleChange('info_category', {
                                ...editProduct.info_category,
                                premium: updatedCategory,
                            })
                        }
                        simpleProducts={simpleProducts}
                    />
                    <CategoryFormSection
                        categoryName="Basic"
                        categoryData={editProduct.info_category.basic}
                        onChange={(updatedCategory) =>
                            handleChange('info_category', {
                                ...editProduct.info_category,
                                basic: updatedCategory,
                            })
                        }
                        simpleProducts={simpleProducts}
                    />
                </div>
                <Group justify="flex-end">
                    <Button variant="default" onClick={onClose}>
                        Anulează
                    </Button>
                    <Button type="submit" color="blue">
                        Salvează
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

const ListOfProducts = ({
    products,
    composedCategories,
    simpleProducts,
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
        info_category: {
            standard: { price: 0, imageSrc: '', composition: [] },
            premium: { price: 0, imageSrc: '', composition: [] },
            basic: { price: 0, imageSrc: '', composition: [] },
        },
        isPopular: false,
        stockCode: '',
        inStock: false,
        description: '',
        colors: '',
        category: composedCategories[0],
        promotion: false,
        newest: false,
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<ComposedProductProps | null>(null);

    React.useEffect(() => {
        setAllProducts(products);
    }, [products]);

    const handleNewProductChange = (field: keyof ComposedProductProps, value: unknown) => {
        if (field === 'info_category') {
            setNewProduct((prev) => ({
                ...prev,
                info_category: {
                    ...prev.info_category,
                    ...(value as Partial<typeof prev.info_category>),
                },
            }));
        } else {
            setNewProduct((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        const productToAdd = {
            ...newProduct,
            id: uuidv4(),
            info_category: {
                standard: {
                    ...newProduct.info_category.standard,
                    imageSrc: newProduct.info_category.standard.imageSrc || '',
                    composition: newProduct.info_category.standard.composition || [],
                },
                premium: {
                    ...newProduct.info_category.premium,
                    imageSrc: newProduct.info_category.premium.imageSrc || '',
                    composition: newProduct.info_category.premium.composition || [],
                },
                basic: {
                    ...newProduct.info_category.basic,
                    imageSrc: newProduct.info_category.basic.imageSrc || '',
                    composition: newProduct.info_category.basic.composition || [],
                },
            },
        };

        try {
            await axios.post(URL_COMPOSED_PRODUCTS, productToAdd);
            setAllProducts((prev) => [...prev, productToAdd]);
            setNewProduct({
                id: uuidv4(),
                title: '',
                info_category: {
                    standard: { price: 0, imageSrc: '', composition: [] },
                    premium: { price: 0, imageSrc: '', composition: [] },
                    basic: { price: 0, imageSrc: '', composition: [] },
                },
                isPopular: false,
                stockCode: '',
                inStock: false,
                description: '',
                colors: '',
                category: composedCategories[0],
                promotion: false,
                newest: false,
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
                            autoFocus={false}
                            value={newProduct.title}
                            onChange={e => handleNewProductChange('title', e.currentTarget.value)}
                            required
                        />
                        <TextInput
                            label="Cod stoc"
                            autoFocus={false}
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
                        <TextInput
                            label="Culori"
                            value={newProduct.colors}
                            autoFocus={false}
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
                        <Checkbox
                            label="Produs nou"
                            checked={newProduct.newest}
                            onChange={e => handleNewProductChange('newest', e.currentTarget.checked)}
                        />
                        <div>
                            <CategoryFormSection
                                categoryName="Standard"
                                categoryData={newProduct.info_category.standard}
                                onChange={(updatedCategory) =>
                                    handleNewProductChange('info_category', {
                                        ...newProduct.info_category,
                                        standard: updatedCategory,
                                    })
                                }
                                simpleProducts={simpleProducts}
                            />
                            <CategoryFormSection
                                categoryName="Premium"
                                categoryData={newProduct.info_category.premium}
                                onChange={(updatedCategory) =>
                                    handleNewProductChange('info_category', {
                                        ...newProduct.info_category,
                                        premium: updatedCategory,
                                    })
                                }
                                simpleProducts={simpleProducts}
                            />
                            <CategoryFormSection
                                categoryName="Basic"
                                categoryData={newProduct.info_category.basic}
                                onChange={(updatedCategory) =>
                                    handleNewProductChange('info_category', {
                                        ...newProduct.info_category,
                                        basic: updatedCategory,
                                    })
                                }
                                simpleProducts={simpleProducts}
                            />
                        </div>
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
                <div className="flex flex-row justify-between gap-2 md:visible invisible">
                    <span className="w-1/10">IMAGINE</span>
                    <span className="w-1/10">DENUMIRE</span>
                    <span className="w-1/10">COD STOC</span>
                    <span className="w-1/10">IN STOC</span>
                    <span className="w-1/10">CATEGORIE</span>
                    <span className="w-1/10">PREMIUM</span>
                    <span className="w-1/10">STANDARD</span>
                    <span className="w-1/10">BASIC</span>
                    <span className="w-1/10">POPULAR</span>
                    <span className="w-1/10">PROMO</span>
                    <span className="w-1/10">NOU</span>
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

        const validPrefixes = ['Buchet', 'Aranjament', 'Eveniment', 'Cadou', ''];
        const validLinks = ['bouquets', 'arrangements', 'occasion&events', 'gifts', 'features'];
        const isValid = validPrefixes.some((prefix) =>
            categoryName.startsWith(prefix)
        );

        const isValidLink = validLinks.includes(link);

        if (!isValidLink) {
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
                    autoFocus={false}
                />
                <Select
                    label="Link"
                    data={['bouquets', 'arrangements', 'occasion&events', 'gifts', 'features']}
                    value={link}
                    onChange={(value) => value && setLink(value)}
                    required
                />
                <p className="text-sm text-gray-500">
                    Numele categoriei trebuie să înceapă cu unul dintre următoarele cuvinte: Buchet, Aranjament, Eveniment, Cadou.
                    Daca vrem sa se afle in Noutati nu trebuie sa respecte ce este mai sus.
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

const DeleteCategoryModal = ({
    opened,
    onClose,
    composedCategories,
    onDeleteCategory,
}: {
    opened: boolean;
    onClose: () => void;
    composedCategories: string[];
    onDeleteCategory: (category: string) => void;
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleDelete = () => {
        if (selectedCategory) {
            onDeleteCategory(selectedCategory);
            setSelectedCategory(null);
            onClose();
        } else {
            alert('Te rugăm să selectezi o categorie!');
        }
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Șterge categorie" centered>
            <div className="flex flex-col gap-4">
                <Select
                    label="Alege o categorie"
                    data={composedCategories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Selectează o categorie"
                    searchable
                />
                <Group justify="flex-end">
                    <Button variant="default" onClick={onClose}>
                        Anulează
                    </Button>
                    <Button color="red" onClick={handleDelete}>
                        Șterge
                    </Button>
                </Group>
            </div>
        </Modal>
    );
};

const Page = () => {
    const [products, setProducts] = useState<ComposedProductProps[]>([]);
    const [simpleProducts, setSimpleProducts] = useState<ProductProps[]>([]);
    const [categoryModalOpen, { open: openCategoryModal, close: closeCategoryModal }] = useDisclosure(false);
    const [deleteCategoryModalOpen, { open: openDeleteCategoryModal, close: closeDeleteCategoryModal }] = useDisclosure(false);
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

    const handleDeleteCategory = (category: string) => {
        if (window.confirm(`Ești sigur că vrei să ștergi categoria "${category}"?`)) {
            try {
                axios.delete(URL_COMPOSED_CATEGORIES, { data: { name: category } }).then(() => {
                    setComposedCategories((prev) => prev.filter((cat) => cat !== category));
                    alert(`Categoria "${category}" a fost ștearsă cu succes!`);
                });
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('A apărut o eroare la ștergerea categoriei.');
            }
        }
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
                    <div className="flex justify-start mt-4 gap-4">
                        <Button color="blue" onClick={openCategoryModal}>
                            Adaugă categorie
                        </Button>
                        <Button color="red" onClick={openDeleteCategoryModal}>
                            Șterge categorie
                        </Button>
                    </div>
                    <CategoryModal
                        opened={categoryModalOpen}
                        onClose={closeCategoryModal}
                        onAddCategory={handleAddCategory}
                    />
                    <DeleteCategoryModal
                        opened={deleteCategoryModalOpen}
                        onClose={closeDeleteCategoryModal}
                        composedCategories={composedCategories}
                        onDeleteCategory={handleDeleteCategory}
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