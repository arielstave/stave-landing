'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { subscribeUser } from '@/app/actions';

export function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('email', email);

            const result = await subscribeUser(formData);

            if (result && result.success) {
                setSuccess(true);
                setEmail('');
            } else {
                throw new Error('Failed to join.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to join. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="waitlist" className="py-24 px-4 bg-gray-50 border-t border-border">
            <div className="container max-w-md mx-auto text-center">

                {/* Social Proof */}
                <div className="inline-flex items-center justify-center mb-6">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
                        +50 builders on the waitlist! 🚀
                    </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight mb-8">Be the first to know.</h2>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-white rounded-xl border border-green-100 shadow-sm text-green-800"
                    >
                        <h3 className="text-xl font-bold mb-2">You're on the list! 🎉</h3>
                        <p className="text-green-700/80">We'll let you know when beta opens.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Input
                            type="email"
                            placeholder="ariel@stave.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12 bg-white text-lg"
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full text-base bg-black text-white hover:bg-black/90 shadow-sm"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Join Waitlist'}
                        </Button>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                )}
            </div>
        </section>
    );
}
