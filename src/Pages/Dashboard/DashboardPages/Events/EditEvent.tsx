import { motion } from "framer-motion";
import { FaArrowLeft, FaSave, FaCalendar, FaClock, FaMapMarkerAlt, FaTag, FaAlignLeft, FaUsers, FaQrcode } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import { getEventById, updateEvent, type Event, type UpdateEventInput } from "../../../../services/eventService";

interface EventFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  expectedAttendees: number;
}

const EditEvent = () => {
  const params = useParams();
  const eventId = params.id as string;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    date: '',
    time: '',
    location: '',
    category: 'service',
    description: '',
    expectedAttendees: 0
  });

  const categories = [
    { value: 'service', label: 'Service' },
    { value: 'bible-study', label: 'Bible Study' },
    { value: 'prayer', label: 'Prayer' },
    { value: 'youth', label: 'Youth' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'service':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'bible-study':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'prayer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'youth':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Load event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event_data = await getEventById(eventId);
        if (event_data) {
          setFormData({
            title: event_data.title,
            date: event_data.date,
            time: event_data.time,
            location: event_data.location,
            category: event_data.category,
            description: event_data.description || '',
            expectedAttendees: event_data.expectedAttendees
          });
        } else {
          toast.error('Event not found');
          navigate('/dashboard/events');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
        navigate('/dashboard/events');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expectedAttendees' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.title || !formData.date || !formData.time || !formData.location) {
        toast.error('Please fill in all required fields');
        setIsSubmitting(false);
        return;
      }

      // Prepare update data
      const updateData: UpdateEventInput = {
        title: formData.title,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category,
        description: formData.description || undefined,
        expectedAttendees: formData.expectedAttendees
      };

      // Update event in Supabase
      const updatedEvent = await updateEvent(eventId, updateData);
      
      console.log('Event updated successfully:', updatedEvent);
      toast.success('Event updated successfully!');
      
      // Navigate back to events page
      navigate('/dashboard/events');
      
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/events');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Event...</h2>
          <p className="text-gray-600">Please wait while we fetch event details</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            to="/dashboard/events"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
        </div>
        <p className="text-gray-600">Update the event details below</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaCalendar className="text-burgundy-600" />
            Event Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                placeholder="e.g., Sunday Service, Bible Study"
              />
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline w-4 h-4 mr-1" />
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
              />
            </div>

            {/* Event Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline w-4 h-4 mr-1" />
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline w-4 h-4 mr-1" />
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                placeholder="e.g., Main Sanctuary, Fellowship Hall"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                <FaTag className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                <FaAlignLeft className="inline w-4 h-4 mr-1" />
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors resize-none"
                placeholder="Provide a detailed description of the event..."
              />
            </div>

            {/* Expected Attendees */}
            <div>
              <label htmlFor="expectedAttendees" className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline w-4 h-4 mr-1" />
                Expected Attendees
              </label>
              <input
                type="number"
                id="expectedAttendees"
                name="expectedAttendees"
                value={formData.expectedAttendees}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500 transition-colors"
                placeholder="0"
              />
            </div>
          </div>
        </motion.div>

        {/* QR Code Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaQrcode className="text-burgundy-600" />
            QR Code Preview
          </h2>
          
          <div className="flex flex-col items-center">
            {formData.title ? (
              <>
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                  <QRCode
                    value={`${window.location.origin}/check-in/${eventId}`}
                    size={200}
                    level="H"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    QR Code for event check-in
                  </p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(formData.category)}`}>
                    {formData.category}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FaQrcode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Enter event details to see QR code preview</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-end"
        >
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-burgundy-600 text-white rounded-lg font-medium hover:bg-burgundy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaSave className="w-4 h-4" />
            {isSubmitting ? 'Updating Event...' : 'Update Event'}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default EditEvent;
