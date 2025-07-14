    import React, { useState, useEffect } from 'react';
    import { ArrowLeft, Save, X } from 'lucide-react';
    import Button from '../common/Button';
    import { Rental, Student, Locker } from '../../types';
    import { apiService } from '../../services/api';

    interface RentalFormProps {
    rental?: Rental | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    }

    const RentalForm: React.FC<RentalFormProps> = ({ rental, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<{
    lockerId: string;
    studentId: string;
    startDate: string;
    endDate: string;
    monthlyPrice: string;
    totalAmount: string;
    status: 'active' | 'completed' | 'cancelled' | 'overdue';
    paymentStatus: 'pending' | 'paid' | 'overdue';
    notes: string;
    }>({
    lockerId: '',
    studentId: '',
    startDate: '',
    endDate: '',
    monthlyPrice: '',
    totalAmount: '',
    status: 'active',
    paymentStatus: 'pending',
    notes: ''
    });


    const [students, setStudents] = useState<Student[]>([]);
    const [lockers, setLockers] = useState<Locker[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        loadStudents();
        loadLockers();
        
        if (rental) {
        setFormData({
            lockerId: rental.locker_id || '',
            studentId: rental.student_id || '',
            startDate: rental.start_date ? rental.start_date.split('T')[0] : '',
            endDate: rental.end_date ? rental.end_date.split('T')[0] : '',
            monthlyPrice: rental.monthly_price?.toString() || '',
            totalAmount: rental.total_amount?.toString() || '',
            status: rental.status || 'active',
            paymentStatus: rental.payment_status || 'pending',
            notes: rental.notes || ''
        });
        }
    }, [rental]);

    const loadStudents = async () => {
        try {
        const response = await apiService.getStudents(1, 1000);
        setStudents(response.data || []);

        } catch (error) {
        console.error('Error loading students:', error);
        }
    };

    const loadLockers = async () => {
    try {
        const response = await apiService.getLockers(1, 1000);
        if (response && response.data) {
        const availableLockers = response.data.filter(locker =>
            locker.status === 'available' || (rental && locker.id === rental.locker_id)
        );
        setLockers(availableLockers);
        }
    } catch (error) {
        console.error('Error loading lockers:', error);
    }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
        }

        // Auto-calculate total amount
        if (name === 'startDate' || name === 'endDate' || name === 'monthlyPrice') {
        calculateTotalAmount(name, value);
        }
    };

    const calculateTotalAmount = (changedField: string, changedValue: string) => {
        const updatedData = { ...formData, [changedField]: changedValue };
        
        if (updatedData.startDate && updatedData.endDate && updatedData.monthlyPrice) {
        const startDate = new Date(updatedData.startDate);
        const endDate = new Date(updatedData.endDate);
        const monthlyPrice = parseFloat(updatedData.monthlyPrice);

        if (startDate < endDate && monthlyPrice > 0) {
            // Calculate number of months
            const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (endDate.getMonth() - startDate.getMonth()) + 1;
            
            const totalAmount = (months * monthlyPrice).toFixed(2);
            
            setFormData(prev => ({
            ...prev,
            totalAmount
            }));
        }
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.lockerId) {
        newErrors.lockerId = 'Armário é obrigatório';
        }

        if (!formData.studentId) {
        newErrors.studentId = 'Aluno é obrigatório';
        }

        if (!formData.startDate) {
        newErrors.startDate = 'Data de início é obrigatória';
        }

        if (!formData.endDate) {
        newErrors.endDate = 'Data de fim é obrigatória';
        }

        if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (startDate >= endDate) {
            newErrors.endDate = 'Data de fim deve ser posterior à data de início';
        }
        }

        if (!formData.monthlyPrice || parseFloat(formData.monthlyPrice) <= 0) {
        newErrors.monthlyPrice = 'Preço mensal deve ser maior que zero';
        }

        if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
        newErrors.totalAmount = 'Valor total deve ser maior que zero';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
        return;
        }

        setLoading(true);

        try {
        await onSubmit({
            lockerId: formData.lockerId,
            studentId: formData.studentId,
            startDate: formData.startDate,
            endDate: formData.endDate,
            monthlyPrice: parseFloat(formData.monthlyPrice),
            totalAmount: parseFloat(formData.totalAmount),
            status: formData.status,
            paymentStatus: formData.paymentStatus,
            notes: formData.notes
        });
        } catch (error) {
        console.error('Error submitting form:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
            <Button
                variant="ghost"
                size="sm"
                icon={ArrowLeft}
                onClick={onCancel}
            />
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                {rental ? 'Editar Locação' : 'Nova Locação'}
                </h1>
                <p className="text-gray-600">
                {rental ? 'Atualize os dados da locação' : 'Preencha os dados para criar uma nova locação'}
                </p>
            </div>
            </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Student and Locker Selection */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Aluno *
                </label>
                <select
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.studentId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                >
                    <option value="">Selecione um aluno</option>
                    {students.map(student => (
                    <option key={student.id} value={student.id}>
                        {student.name} - {student.email}
                    </option>
                    ))}
                </select>
                {errors.studentId && (
                    <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
                )}
                </div>

                <div>
                <label htmlFor="lockerId" className="block text-sm font-medium text-gray-700 mb-2">
                    Armário *
                </label>
                <select
                    id="lockerId"
                    name="lockerId"
                    value={formData.lockerId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lockerId ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                >
                    <option value="">Selecione um armário</option>
                    {lockers.map(locker => (
                    <option key={locker.id} value={locker.id}>
                        #{locker.number} - {locker.location}
                    </option>
                    ))}
                </select>
                {errors.lockerId && (
                    <p className="mt-1 text-sm text-red-600">{errors.lockerId}</p>
                )}
                </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Início *
                </label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.startDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
                </div>

                <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Fim *
                </label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.endDate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
                </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700 mb-2">
                    Preço Mensal (R$) *
                </label>
                <input
                    type="number"
                    id="monthlyPrice"
                    name="monthlyPrice"
                    value={formData.monthlyPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.monthlyPrice ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.monthlyPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthlyPrice}</p>
                )}
                </div>

                <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Total (R$) *
                </label>
                <input
                    type="number"
                    id="totalAmount"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.totalAmount ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                />
                {errors.totalAmount && (
                    <p className="mt-1 text-sm text-red-600">{errors.totalAmount}</p>
                )}
                </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                </label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="active">Ativa</option>
                    <option value="completed">Concluída</option>
                    <option value="overdue">Em Atraso</option>
                    <option value="cancelled">Cancelada</option>
                </select>
                </div>

                <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    Status do Pagamento
                </label>
                <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="pending">Pendente</option>
                    <option value="paid">Pago</option>
                    <option value="overdue">Em Atraso</option>
                </select>
                </div>
            </div>

            {/* Notes */}
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Observações
                </label>
                <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Observações sobre a locação..."
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                type="button"
                variant="ghost"
                icon={X}
                onClick={onCancel}
                disabled={loading}
                >
                Cancelar
                </Button>
                <Button
                type="submit"
                icon={Save}
                disabled={loading}
                >
                {loading ? 'Salvando...' : (rental ? 'Atualizar' : 'Criar')}
                </Button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default RentalForm;