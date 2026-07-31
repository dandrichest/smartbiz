/* eslint-disable no-unused-vars */
import { useState, useCallback } from 'react';
import { FORM_CONSTRAINTS } from '../constants/homePageData';

const INITIAL_FORM_STATE = { name: '', role: '', quote: '', rating: 5 };

/**
 * Sanitises a string: trims whitespace and strips HTML tags.
 * @param {string} value
 * @returns {string}
 */
const sanitize = (value) =>
    value.trim().replace(/<[^>]*>/g, '');

/**
 * Validates the testimonial form and returns an errors object.
 * @param {{ name: string, role: string, quote: string }} fields
 * @returns {Record<string, string>}
 */
const validate = ({ name, role, quote }) => {
    const errors = {};
    const { min: nMin, max: nMax } = FORM_CONSTRAINTS.name;
    const { min: rMin, max: rMax } = FORM_CONSTRAINTS.role;
    const { min: qMin, max: qMax } = FORM_CONSTRAINTS.quote;

    if (!name) {
        errors.name = 'Name is required.';
    } else if (name.length < nMin) {
        errors.name = `Name must be at least ${nMin} characters.`;
    } else if (name.length > nMax) {
        errors.name = `Name must be ${nMax} characters or fewer.`;
    }

    if (!role) {
        errors.role = 'Role / company is required.';
    } else if (role.length < rMin) {
        errors.role = `Role must be at least ${rMin} characters.`;
    } else if (role.length > rMax) {
        errors.role = `Role must be ${rMax} characters or fewer.`;
    }

    if (!quote) {
        errors.quote = 'Testimonial text is required.';
    } else if (quote.length < qMin) {
        errors.quote = `Please write at least ${qMin} characters.`;
    } else if (quote.length > qMax) {
        errors.quote = `Testimonial must be ${qMax} characters or fewer.`;
    }

    return errors;
};

const useTestimonialForm = (onSubmitSuccess) => {
    const [formData, setFormData]   = useState(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear the error for this field as the user types
        setFormErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (isSubmitting) return;

            const sanitized = {
                name:   sanitize(formData.name),
                role:   sanitize(formData.role),
                quote:  sanitize(formData.quote),
                rating: formData.rating,
            };

            const errors = validate(sanitized);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                return;
            }

            setIsSubmitting(true);
            try {
                // In production: await api.postTestimonial(sanitized);
                await new Promise((resolve) => setTimeout(resolve, 400)); // mock latency

                const newEntry = {
                    id: crypto.randomUUID(),
                    ...sanitized,
                    avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(sanitized.name)}`,
                };
                onSubmitSuccess(newEntry);
                setFormData(INITIAL_FORM_STATE);
                setFormErrors({});
            } catch (err) {
                setFormErrors({ submit: 'Something went wrong. Please try again.' });
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, isSubmitting, onSubmitSuccess],
    );

    const reset = useCallback(() => {
        setFormData(INITIAL_FORM_STATE);
        setFormErrors({});
    }, []);

    return {
        formData,
        formErrors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
    };
};

export default useTestimonialForm;