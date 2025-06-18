'use client';
import { IconBrandFacebook, IconBrandInstagram, IconBrandWhatsapp, IconHeartBroken, IconHeartFilled } from '@tabler/icons-react';
import { Modal, TextInput, Textarea, Button, Group } from '@mantine/core';
import { useBlogPosts } from '../components/hooks/fetchBlogPosts';
import { IconDotsVertical } from '@tabler/icons-react';
import { useUser } from '../components/ContextUser'; 
import React, { useState, useEffect } from 'react';
import { Menu, ActionIcon } from '@mantine/core';
import { Loader, Tooltip } from '@mantine/core';
import { Footer } from '../components/Footer';
import { BlogPostProps } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


const URL_BLOG_POSTS = '/api/post';
const Post = ({ blogPost, onDelete }: { blogPost: BlogPostProps; onDelete: (id: string) => void }) => {
  const { user } = useUser();
  const surname = user.userInfo.surname;
  const [post, setPost] = useState<BlogPostProps>(blogPost);

  const handleLike = async () => {
    if (!post.likedBy.includes(surname)) {
      setPost({
        ...post,
        likes: post.likes + 1,
        likedBy: [...post.likedBy, surname],
      });
      try {
        await axios.put(URL_BLOG_POSTS, {
          id: post.id,
          likes: post.likes + 1,
          likedBy: [...post.likedBy, surname],
        });
      } catch (error) {
        console.error('Eroare la actualizarea like-ului:', error);
      }
    }
  };

  const handleDislike = async () => {
    if (!post.dislikedBy.includes(surname)) {
      setPost({
        ...post,
        dislikes: post.dislikes + 1,
        dislikedBy: [...post.dislikedBy, surname],
      });
      try {
        await axios.put(URL_BLOG_POSTS, {
          id: post.id,
          dislikes: post.dislikes + 1,
          dislikedBy: [...post.dislikedBy, surname],
        });
      } catch (error) {
        console.error('Eroare la actualizarea dislike-ului:', error);
      }
    }
  };

  const getPageUrl = () => {
    return window.location.href;
  }

  const shareOnWhatsApp = () => {
    const pageUrl = getPageUrl();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(pageUrl)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnFacebook = () => {
    const pageUrl = getPageUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  const shareOnInstagram = () => {
    const instagramProfileUrl = `https://www.instagram.com/yourprofile/`; // Înlocuiește `yourprofile` cu profilul tău Instagram
    window.open(instagramProfileUrl, '_blank');
  };

  return (
    <div className="overflow-hidden py-10 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="text-gray-500 text-sm mb-2">{post.date}</p>
          <p className="text-gray-700 pb-5">{post.description}</p>
        </div>
        {user.isAuthenticated && user.userInfo.email === 'matei.partac45@gmail.com' && (
          <Menu>
            <Menu.Target>
              <ActionIcon>
                <div className='bg-white'>
                  <IconDotsVertical color='black' />
                </div>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                onClick={() => onDelete(post.id)}
              >
                Șterge postarea
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </div>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-xl h-50dvh object-cover pb-5"
        />
      )}
      {/* likes */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <Tooltip
            withArrow
            transitionProps={{ duration: 200 }}
            label={`${user.isAuthenticated ? 'Like' : 'Trebuie să intri în cont'}`}
          >
            <button
              onClick={handleLike}
              disabled={post.likedBy.includes(surname) || post.dislikedBy.includes(surname) || !user.isAuthenticated}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <IconHeartFilled color={post.likedBy.includes(surname) ? 'red' : 'gray'} />
              <span className="text-gray-500">{post.likes}</span>
            </button>
          </Tooltip>
          <button
            onClick={handleDislike}
            disabled={post.dislikedBy.includes(surname) || post.likedBy.includes(surname) || !user.isAuthenticated}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <IconHeartBroken />
            <span className="text-gray-500">{post.dislikes}</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <p>Share on</p>
          <button className="flex items-center space-x-2 cursor-pointer" onClick={shareOnWhatsApp}>
            <IconBrandWhatsapp />
          </button>
          <button className="flex items-center space-x-2 cursor-pointer" onClick={shareOnFacebook}>
            <IconBrandFacebook />
          </button>
          <button className="flex items-center space-x-2 cursor-pointer" onClick={shareOnInstagram}>
            <IconBrandInstagram />
          </button>
        </div>
      </div>
      <p className="text-gray-400 text-xs">
        Utilizatori care au dat like: {post.likedBy.slice(0, 3).join(', ')}{' '}
        {post.likedBy.length - 3 > 0 ? `+${post.likedBy.length - 3}` : ''}
      </p>
    </div>
  );
};

const Content = ({ blogPosts, onDelete }: { blogPosts: BlogPostProps[], onDelete: (id: string) => void }) => {
  return (
    <div className="my-20 md:mx-[25%] p-4">
      <div className="flex flex-col">
        {blogPosts.map((post, index) => (
          <Post blogPost={post} key={index} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

const CreatePostModal = ({
  opened,
  onClose,
  onSave,
}: {
  opened: boolean;
  onClose: () => void;
  onSave: (newPost: BlogPostProps) => void;
}) => {
  const [newPost, setNewPost] = useState<BlogPostProps>({
    id: uuidv4(),
    title: '',
    date: new Date().toLocaleDateString(),
    description: '',
    image: null,
    likes: 0,
    dislikes: 0,
    likedBy: [],
    dislikedBy: [],
  });

  useEffect(() => {
    if (!opened) {
      setNewPost({
        id: uuidv4(),
        title: '',
        date: new Date().toLocaleDateString(),
        description: '',
        image: null,
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      });
    }
  }, [opened]);

  const handleChange = (field: keyof BlogPostProps, value: unknown) => {
    setNewPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleChange('image', ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newPost);
    onClose();
    window.location.reload();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Creează o postare nouă" centered>
      <form className="flex flex-col gap-4 max-w-md mx-auto mt-10" onSubmit={handleSubmit}>
        <TextInput
          label="Titlu"
          value={newPost.title}
          onChange={(e) => handleChange('title', e.currentTarget.value)}
          required
          autoFocus={false}
        />
        <Textarea
          label="Descriere"
          value={newPost.description}
          onChange={(e) => handleChange('description', e.currentTarget.value)}
          required
        />
        <div>
          <label className="block mb-1 font-medium">Imagine</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block cursor-pointer w-full text-sm text-gray-500 border border-gray-300 rounded focus:outline-none focus:ring ring-blue-500"
          />
          {newPost.image && (
            <img
              src={newPost.image as string}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded border"
            />
          )}
          {newPost.image && (
            <Button
              variant="outline"
              color="red"
              onClick={() => handleChange('image', null)}
              className="mt-2"
            >
              Șterge imaginea
            </Button>
          )}
        </div>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Anulează
          </Button>
          <Button type="submit" color="blue">
            Creează
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

const Blog = () => {
  const { user } = useUser();
  const [modalOpened, setModalOpened] = useState(false);
  const { data: blogPosts, isLoading, isError } = useBlogPosts();

  const handleDeletePost = async (id: string) => {
    try {
      await axios.delete(URL_BLOG_POSTS, { data: { id } });
      window.location.reload();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

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

  if (!blogPosts) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Nu există postări disponibile.</p>
      </div>
    );
  }

  const handleCreatePost = async (newPost: BlogPostProps) => {
    try {
      await axios.post(URL_BLOG_POSTS, newPost);
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  return (
    <div>
      {user.isAuthenticated && user.userInfo.email === 'matei.partac45@gmail.com' && (
        <div className="flex pl-5 justify-center mt-28">
          <Button color="pink" onClick={() => setModalOpened(true)}>
            Creează o postare
          </Button>
        </div>
      )}
      <Content blogPosts={blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} onDelete={handleDeletePost} />
      <Footer />
      <CreatePostModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSave={handleCreatePost}
      />
    </div>
  );
};

export default Blog;