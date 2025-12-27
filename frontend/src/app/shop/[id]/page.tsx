"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/shop/ProductGallery";
import ProductInfo from "@/components/shop/ProductInfo";
import ProductSlider from "@/components/ProductSlider";
import Loader from '@/components/ui/Loader';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
    const params = useParams();
    const id = params?.id;
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/item/${id}`);
                if (!res.ok) {
                    setProduct(null);
                    return;
                }
                const data = await res.json();

                // The backend returns { product: {...}, related: [...] }
                setProduct(data.product);
                // Map related products to match ProductCard props
                const mappedRelated = (data.related || []).map((p: any) => ({
                    id: p.product_id,
                    product_id: p.product_id, // Keep both for compatibility
                    name: p.product_name,
                    price: p.price,
                    imageFront: p.image_front,
                    imageBack: p.image_back,
                    category: p.licence_name || 'GENERIC',
                    stock: p.stock,
                    discount: p.discount,
                    installments: p.dues ? `${p.dues} CUOTAS SIN INTERÉS` : undefined,
                    created_at: p.created_at
                }));
                setRelatedProducts(mappedRelated);

            } catch (error) {
                console.error("Error fetching product:", error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = (quantity: number) => {
        if (product) {
            addToCart(product.product_id, quantity);
        }
    };

    if (loading) return (
        <div className="bg-dark-bg min-h-screen flex items-center justify-center">
            <Loader />
        </div>
    );

    if (!product) return (
        <div className="bg-dark-bg min-h-screen flex items-center justify-center text-white">
            Producto no encontrado
        </div>
    );

    return (
        <div className="bg-dark-bg min-h-screen flex flex-col">
            <main className="flex-grow pt-24 md:pt-32 pb-12 md:pb-20">
                <div className="container-custom">
                    {/* Breadcrumbs (Simple) */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 uppercase tracking-wider font-bold">
                        <span>Inicio</span> / <span>Tienda</span> / <span className="text-primary">{product.licence_name}</span>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 mb-16 md:mb-32">
                        {/* Gallery */}
                        <div className="h-full">
                            <ProductGallery images={[product.image_front, product.image_back].filter(Boolean)} />
                        </div>

                        {/* Info */}
                        <div className="lg:pl-8">
                            <ProductInfo
                                id={product.product_id}
                                category={product.licence_name || "General"}
                                name={product.product_name}
                                price={product.price}
                                stock={product.stock}
                                description={product.product_description}
                                licence={product.licence_name}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="border-t border-white/10 pt-20">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h3 className="text-primary font-bold tracking-widest uppercase mb-2">Completa tu Colección</h3>
                                <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic">También te Puede Gustar</h2>
                            </div>
                        </div>
                        <ProductSlider products={relatedProducts} />
                    </div>

                    {/* Reviews Section Mockup */}
                    <div className="mt-16 md:mt-32 border-t border-white/10 pt-12 md:pt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="col-span-1">
                            <h2 className="text-3xl font-black text-white uppercase italic mb-8">Opiniones de Clientes</h2>
                            <div className="flex items-baseline gap-4 mb-4">
                                <span className="text-6xl font-black text-white">4.8</span>
                                <div className="flex text-primary text-xl">{'★'.repeat(5)}</div>
                            </div>
                            <p className="text-gray-400 mb-8">Basado en 124 opiniones</p>
                        </div>
                        <div className="col-span-2 space-y-8">
                            {/* Reviews will be mapped here when API is ready */}
                            <p className="text-gray-500">Aún no hay opiniones.</p>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
