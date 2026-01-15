'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { GlassButton } from '@/components/ui/GlassButton';
import { useTranslation } from '@/contexts';
import { ArrowRight, Clock, DollarSign, Users, TrendingUp, Calculator } from 'lucide-react';

interface ROIInputs {
  hoursSavedWeekly: number;
  costReductionMonthly: number;
  employeesAffected: number;
  revenueIncreasePercent: number;
}

interface ROIResults {
  annualTimeSavings: number;
  annualCostSavings: number;
  productivityGain: number;
  totalAnnualValue: number;
}

function calculateROI(inputs: ROIInputs): ROIResults {
  const annualTimeSavings = inputs.hoursSavedWeekly * 52;
  const annualCostSavings = inputs.costReductionMonthly * 12;

  // Productivity gain: hours saved * employees * average hourly rate ($50)
  const productivityGain = annualTimeSavings * inputs.employeesAffected * 50;

  // Revenue increase as dollar amount (assuming $1M baseline for calculation display)
  const revenueGain = (inputs.revenueIncreasePercent / 100) * 100000;

  const totalAnnualValue = annualCostSavings + productivityGain + revenueGain;

  return {
    annualTimeSavings,
    annualCostSavings,
    productivityGain,
    totalAnnualValue,
  };
}

export default function ROICalculatorPage() {
  const { t } = useTranslation();

  const [inputs, setInputs] = useState<ROIInputs>({
    hoursSavedWeekly: 10,
    costReductionMonthly: 5000,
    employeesAffected: 10,
    revenueIncreasePercent: 15,
  });

  const results = calculateROI(inputs);

  const updateInput = <K extends keyof ROIInputs>(key: K, value: ROIInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="min-h-screen pt-32 pb-20">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--gray-100)] text-sm text-[var(--gray-600)] mb-6">
            <Calculator className="w-4 h-4" />
            {t('roi.title')}
          </div>
          <h1 className="text-4xl md:text-5xl font-[var(--font-display)] font-light text-[var(--black)] mb-4">
            {t('roi.title')}
          </h1>
          <p className="text-lg text-[var(--gray-500)] max-w-xl mx-auto">
            {t('roi.subtitle')}
          </p>
        </motion.div>

        {/* Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Inputs Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl border border-[var(--gray-200)] p-6 md:p-8 space-y-8"
          >
            <RangeSlider
              label={t('roi.hoursSaved')}
              value={inputs.hoursSavedWeekly}
              onChange={(v) => updateInput('hoursSavedWeekly', v)}
              min={1}
              max={100}
              suffix=" hrs"
            />

            <RangeSlider
              label={t('roi.costReduction')}
              value={inputs.costReductionMonthly}
              onChange={(v) => updateInput('costReductionMonthly', v)}
              min={0}
              max={50000}
              step={500}
              prefix="$"
            />

            <RangeSlider
              label={t('roi.employees')}
              value={inputs.employeesAffected}
              onChange={(v) => updateInput('employeesAffected', v)}
              min={1}
              max={500}
            />

            <RangeSlider
              label={t('roi.revenueIncrease')}
              value={inputs.revenueIncreasePercent}
              onChange={(v) => updateInput('revenueIncreasePercent', v)}
              min={0}
              max={100}
              suffix="%"
            />
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[var(--gray-50)] rounded-2xl border border-[var(--gray-200)] p-6 md:p-8"
          >
            <h2 className="text-xl font-[var(--font-display)] font-medium text-[var(--black)] mb-8">
              {t('roi.results.title')}
            </h2>

            <div className="space-y-6">
              {/* Annual Time Savings */}
              <ResultCard
                icon={<Clock className="w-5 h-5" />}
                label={t('roi.results.annualTimeSavings')}
                value={results.annualTimeSavings}
                suffix={` ${t('roi.results.hours')}`}
              />

              {/* Annual Cost Savings */}
              <ResultCard
                icon={<DollarSign className="w-5 h-5" />}
                label={t('roi.results.annualCostSavings')}
                value={results.annualCostSavings}
                prefix="$"
              />

              {/* Productivity Gain */}
              <ResultCard
                icon={<Users className="w-5 h-5" />}
                label={t('roi.results.productivityGain')}
                value={results.productivityGain}
                prefix="$"
              />

              {/* Total Annual Value */}
              <div className="pt-6 border-t border-[var(--gray-300)]">
                <ResultCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  label={t('roi.results.totalAnnualValue')}
                  value={results.totalAnnualValue}
                  prefix="$"
                  isHighlighted
                />
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 pt-8 border-t border-[var(--gray-200)]">
              <p className="text-[var(--gray-600)] mb-4">
                {t('roi.cta')}
              </p>
              <GlassButton
                href="/contact"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                className="group w-full justify-center"
              >
                {t('roi.ctaButton')}
              </GlassButton>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

interface ResultCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  isHighlighted?: boolean;
}

function ResultCard({ icon, label, value, prefix = '', suffix = '', isHighlighted = false }: ResultCardProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-lg
          ${isHighlighted ? 'bg-[var(--black)] text-white' : 'bg-white text-[var(--gray-600)]'}
        `}>
          {icon}
        </div>
        <span className={`text-sm ${isHighlighted ? 'font-medium text-[var(--black)]' : 'text-[var(--gray-600)]'}`}>
          {label}
        </span>
      </div>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`
          text-xl font-semibold tabular-nums
          ${isHighlighted ? 'text-[var(--black)]' : 'text-[var(--gray-800)]'}
        `}
      >
        {prefix}{value.toLocaleString()}{suffix}
      </motion.span>
    </div>
  );
}
