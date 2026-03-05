import { motion } from "framer-motion";
import { FaQrcode, FaArrowLeft, FaDownload, FaPrint, FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { getEventById, deleteEvent, type Event } from "../../../../services/eventService";
import { toast } from "react-toastify";
import DeleteModal from "../../../../Components/DeleteModal";

const EventDetails = () => {
  const params = useParams();
  const eventId = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [checkInUrl, setCheckInUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event_data = await getEventById(eventId);
        if (event_data) {
          setEvent(event_data);
          // Generate check-in URL
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
          setCheckInUrl(`${baseUrl}/check-in/${eventId}`);
        } else {
          toast.error('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCopyUrl = async () => {
    if (checkInUrl) {
      try {
        await navigator.clipboard.writeText(checkInUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a canvas element to download the QR code as an image
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Download the image
        const link = document.createElement('a');
        link.download = `${event?.title.replace(/\s+/g, '-')}-qr-code.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleEdit = () => {
    navigate(`/dashboard/events/edit/${eventId}`);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!event) return;

    try {
      setDeleting(true);
      await deleteEvent(eventId);
      toast.success('Event deleted successfully');
      navigate('/dashboard/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Event...</h2>
          <p className="text-gray-600">Please wait while we fetch the event details</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/dashboard/events"
            className="inline-flex items-center gap-2 bg-burgundy-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-burgundy-700 transition-colors"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/dashboard/events"
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Event QR Code
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Generate and manage QR code for event check-in
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              title="Edit Event"
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Event"
            >
              {deleting ? (
                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <FaTrash className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-burgundy-100 rounded-lg">
                  <FaQrcode className="text-2xl text-burgundy-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
                    {event.category.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaCalendar className="w-5 h-5 text-burgundy-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Date</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaClock className="w-5 h-5 text-burgundy-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-burgundy-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                {event.attendeeCount && (
                  <div className="flex items-start gap-3">
                    <FaUsers className="w-5 h-5 text-burgundy-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-800">Expected Attendees</p>
                      <p className="text-gray-600">{event.attendeeCount} people</p>
                    </div>
                  </div>
                )}

                {event.description && (
                  <div>
                    <p className="font-medium text-gray-800 mb-2">Description</p>
                    <p className="text-gray-600">{event.description}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
                Check-in QR Code
              </h3>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCode
                    id="qr-code-svg"
                    value={checkInUrl}
                    size={256}
                    level="H"
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
              </div>

              {/* Check-in URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={checkInUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Copy URL"
                  >
                    <FaCopy className="w-4 h-4" />
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-1">URL copied to clipboard!</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 bg-burgundy-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-burgundy-700 transition-colors"
                >
                  <FaPrint className="w-4 h-4" />
                  Print
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  <FaDownload className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">How to use:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Display this QR code at the event entrance</li>
                  <li>• Members can scan it with their phone cameras</li>
                  <li>• They'll be taken to the check-in page</li>
                  <li>• They'll enter their phone/email to mark attendance</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone and all associated data will be permanently removed."
        itemName={event?.title || ''}
        isDeleting={deleting}
      />
    </div>
  );
};

export default EventDetails;
