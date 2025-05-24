'use client';
import React, { useEffect, useState } from 'react';
import { SidebarDemo } from "../components/SideBar";
import { Select, Button, Modal, TextInput, NumberInput, Checkbox, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ProductProps } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// adaugare optiune de a adauga si crea categoria
const categories = [
  'Trandafiri', 'Decoratiuni', 'Ghivece', 'Ingrijire', 'Plante de apartament', 'Plante de gradina',
  'Plante de interior', 'Plante de exterior', 'Plante de birou', 'Plante de balcon', 'Plante de terasa',
  'Plante de gradina verticala', 'Plante de acoperis', 'Plante de perete verde', 'Plante de perete vertical',
  'Plante de perete decorativ', 'Plante de perete cu flori', 'Plante de perete cu frunze',
  'Plante de perete cu ierburi', 'Plante de perete cu arbuști'
];

const URL_SIMPLE_PRODUCTS = 'http://localhost:3000/api/products';
const SimpleProductRow = ({
  product,
  onDelete,
  onUpdate, // adaugă această prop
}: {
  product: ProductProps;
  onDelete: (id: string) => void;
  onUpdate: (updatedProduct: ProductProps) => void; // nou
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductProps>({ ...product });

  // Actualizează local valorile din formular
  const handleChange = (field: keyof ProductProps, value: unknown) => {
    setEditProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Salvează modificările și notifică lista
  const handleSave = () => {
    axios.put(URL_SIMPLE_PRODUCTS, editProduct)
      .then(response => {
        if (response.status === 200) {
          onUpdate(editProduct); // notifică lista cu produsul actualizat
        }
        close();
      })
      .catch(error => {
        console.error('Error updating product:', error);
      });
  };

  const handleDelete = () => {
    onDelete(product.id);
    setConfirmDelete(false);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Actualizare produs"
        fullScreen={true}
      >
        <form
          className="flex flex-col gap-4 max-w-md mx-auto mt-10"
          onSubmit={e => { e.preventDefault(); handleSave(); }}
        >
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
            data={categories}
            value={editProduct.category}
            onChange={value => handleChange('category', value || categories[0])}
            required
          />
          <NumberInput
            label="Cantitate"
            value={editProduct.quantity}
            onChange={value => handleChange('quantity', value ?? 0)}
            required
            min={0}
          />
          <NumberInput
            label="Preț"
            value={editProduct.price}
            onChange={value => handleChange('price', value ?? 0)}
            required
            min={0}
            step={0.01}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>Anulează</Button>
            <Button type="submit" color="blue">Salvează</Button>
          </Group>
        </form>
      </Modal>
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
            <Button color="red" onClick={handleDelete}>
              Șterge
            </Button>
          </Group>
        </div>
      </Modal>
      <div className="flex flex-row justify-between gap-2">
        <p className="w-1/6">{product.stockCode}</p>
        <h2 className="w-1/6">{product.title}</h2>
        <p className="w-1/6">{product.inStock ? "Da" : "Nu"}</p>
        <p className="w-1/6">{product.category}</p>
        <p className="w-1/6">{product.quantity}</p>
        <p className="w-1/6">{product.price} RON</p>
        <div className="w-1/6 flex justify-center gap-2">
          <Button
            variant="outline"
            color="blue"
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={open}
          >
            EDITARE
          </Button>
          <Button
            variant="outline"
            color="red"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => setConfirmDelete(true)}
          >
            Șterge
          </Button>
        </div>
      </div>
    </>
  );
};

const ListOfProducts = (
  { products, categories }:
  { products: ProductProps[]; categories: string[] }
) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0]);
  const [allProducts, setAllProducts] = useState<ProductProps[]>(products);
  const [newProduct, setNewProduct] = useState<ProductProps>({
    id: "",
    title: "",
    stockCode: "",
    inStock: true,
    category: categories[0],
    quantity: 0,
    price: 0,
  });

  React.useEffect(() => {
    setAllProducts(products);
  }, [products]);

  const handleNewProductChange = (field: keyof ProductProps, value: unknown) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd = { ...newProduct, id: uuidv4() };
    try {
      await axios.post(URL_SIMPLE_PRODUCTS, productToAdd);
      setAllProducts((prev) => [...prev, productToAdd]);
      setNewProduct({
        id: "",
        title: "",
        stockCode: "",
        inStock: true,
        category: categories[0],
        quantity: 0,
        price: 0,
      });
      close();
      alert("Produs adăugat cu succes!");
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = (id: string) => {
    axios.delete(URL_SIMPLE_PRODUCTS, { data: { id } })
      .then(() => {
        setAllProducts((prev) => prev.filter((p) => p.id !== id));
        alert("Produs șters cu succes!");
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
      });
  };  

  // Adaugă această funcție pentru update local
  const handleUpdateProduct = (updatedProduct: ProductProps) => {
    setAllProducts(prev =>
      prev.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  return (
    <div className="flex flex-col gap-2 my-2">
      <div className="flex flex-row justify-between gap-2">
        <Button
          variant="outline"
          color="blue"
          onClick={open}
        >
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
              data={categories}
              value={newProduct.category}
              onChange={value => handleNewProductChange('category', value || categories[0])}
              required
            />
            <NumberInput
              label="Cantitate"
              value={newProduct.quantity}
              onChange={value => handleNewProductChange('quantity', value ?? 0)}
              required
              min={0}
            />
            <NumberInput
              label="Preț"
              value={newProduct.price}
              onChange={value => handleNewProductChange('price', value ?? 0)}
              required
              min={0}
              step={0.01}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={close}>Anulează</Button>
              <Button type="submit" color="blue">Adaugă</Button>
            </Group>
          </form>
        </Modal>
      </div>
      <Select
        label="Alege o categorie"
        data={categories}
        value={selectedCategory}
        onChange={setSelectedCategory}
        allowDeselect={false}
        classNames={{
          input: 'bg-neutral-800 text-white',
        }}
      />
      <div className="flex flex-col gap-2 my-2">
        <div className="flex flex-row justify-between gap-2">
          <p className="w-1/6 text-lg font-bold">COD STOC</p>
          <p className="w-1/6 text-lg font-bold">DENUMIRE</p>
          <p className="w-1/6 text-lg font-bold">IN STOC</p>
          <p className="w-1/6 text-lg font-bold">CATEGORIE</p>
          <p className="w-1/6 text-lg font-bold">CANTITATE</p>
          <p className="w-1/6 text-lg font-bold">PRET</p>
          <p className="w-1/6 text-lg font-bold">ACTUALIZARE</p>
        </div>
        <div className="h-1 border-b border-neutral-200 dark:border-neutral-700" />
        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-400px)]">
          {allProducts
            .filter(product => product.category === selectedCategory)
            .map((product) => (
              <div key={product.id} className="flex flex-col gap-2">
                <SimpleProductRow
                  product={product}
                  onDelete={handleDeleteProduct}
                  onUpdate={handleUpdateProduct} // adaugă prop-ul aici
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);

  function fetchProducts() {
    axios.get(URL_SIMPLE_PRODUCTS).then((response) => {
      setProducts(response.data);
    });
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <SidebarDemo>
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex gap-2">
            <div
              className="h-20 w-full text-center py-7 animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700"
            >
              <h1>STOC SI PRODUSE SIMPLE</h1>
            </div>
          </div>
          <ListOfProducts products={products} categories={categories} />
        </div>
      </div>
    </SidebarDemo>
  );
};

export default Page;