import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { apiRequest } from '../lib/api';

const Quote = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: null });

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus({ loading: true, error: null, success: null });

        try {
            await apiRequest('/api/quotes', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: form.message,
                }),
            });
            setStatus({ loading: false, error: null, success: '견적 요청이 접수되었습니다. 곧 연락드리겠습니다.' });
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            setStatus({
                loading: false,
                error: error.message || '견적 요청에 실패했습니다.',
                success: null,
            });
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 font-heading text-center">견적 문의</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Project Quote</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        오피스, 카페, 라운지 등 공간의 목적에 맞는 가구 큐레이션과 견적을 제안해 드립니다.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-700">
                                <Phone size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Call Us</p>
                                <p className="font-bold">02-1234-5678</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center text-lime-700">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold">Email Us</p>
                                <p className="font-bold">hello@respace.kr</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-3xl space-y-4">
                    <input
                        type="text"
                        value={form.name}
                        onChange={handleChange('name')}
                        placeholder="이름 / 회사명"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200"
                        required
                    />
                    <input
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        placeholder="이메일"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200"
                        required
                    />
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        placeholder="연락처"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    />
                    <textarea
                        value={form.message}
                        onChange={handleChange('message')}
                        placeholder="문의 내용 (공간 유형, 예산 등)"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    ></textarea>

                    {status.error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                            {status.error}
                        </div>
                    )}
                    {status.success && (
                        <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl p-3">
                            {status.success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status.loading}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-colors disabled:opacity-60"
                    >
                        {status.loading ? '전송 중...' : '문의하기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Quote;
