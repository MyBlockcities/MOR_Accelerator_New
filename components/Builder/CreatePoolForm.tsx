import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { parseEther } from 'viem';
import { z } from 'zod';

interface CreatePoolFormProps {
  onSubmit: (data: PoolFormData) => void;
  onCancel: () => void;
}

export const poolFormSchema = z.object({
  name: z.string().min(3, 'Pool name must be at least 3 characters'),
  minStake: z.string().refine((val) => {
    try {
      const amount = parseEther(val);
      return amount > 0n;
    } catch {
      return false;
    }
  }, 'Invalid minimum stake amount'),
  maxStake: z.string().refine((val) => {
    try {
      const amount = parseEther(val);
      return amount > 0n;
    } catch {
      return false;
    }
  }, 'Invalid maximum stake amount'),
  apr: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0 && num <= 100;
  }, 'APR must be between 0 and 100'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export type PoolFormData = z.infer<typeof poolFormSchema>;

const CreatePoolForm: React.FC<CreatePoolFormProps> = ({ onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PoolFormData>();

  const onFormSubmit = async (data: PoolFormData) => {
    try {
      const validatedData = poolFormSchema.parse(data);
      await onSubmit(validatedData);
    } catch (error) {
      console.error('Form validation error:', error);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Pool Name
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="minStake"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Minimum Stake (ETH)
        </label>
        <input
          type="text"
          id="minStake"
          {...register('minStake')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.minStake && (
          <p className="mt-1 text-sm text-red-600">{errors.minStake.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="maxStake"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Maximum Stake (ETH)
        </label>
        <input
          type="text"
          id="maxStake"
          {...register('maxStake')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.maxStake && (
          <p className="mt-1 text-sm text-red-600">{errors.maxStake.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="apr"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          APR (%)
        </label>
        <input
          type="number"
          id="apr"
          {...register('apr')}
          min="0"
          max="100"
          step="0.1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.apr && (
          <p className="mt-1 text-sm text-red-600">{errors.apr.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Pool'}
        </button>
      </div>
    </motion.form>
  );
};

export default CreatePoolForm; 