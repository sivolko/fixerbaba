import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { STEPPING_TILES_REVIEWS } from './data';
import { Booking } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Seed initial reviews from local data.ts if the Firestore reviews collection is empty
 */
export async function seedReviewsIfEmpty() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    if (snapshot.empty) {
      console.log('Seeding initial reviews into Firestore...');
      for (const review of STEPPING_TILES_REVIEWS) {
        // Use setDoc with custom ID or addDoc. Let's use setDoc with review ID to avoid duplicates
        await setDoc(doc(db, 'reviews', review.id), {
          ...review,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Successfully seeded reviews into Firestore!');
    }
  } catch (err) {
    console.error('Failed to seed reviews:', err);
  }
}

/**
 * Fetch all reviews from Firestore
 */
export async function fetchReviewsFromFirestore() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    const reviewsList: any[] = [];
    snapshot.forEach((doc) => {
      reviewsList.push({ id: doc.id, ...doc.data() });
    });
    // Sort by ID or date so they are in a nice order
    return reviewsList.length > 0 ? reviewsList : STEPPING_TILES_REVIEWS;
  } catch (err) {
    console.error('Error fetching reviews from Firestore, using fallback:', err);
    return STEPPING_TILES_REVIEWS;
  }
}

/**
 * Add a new customer review to Firestore
 */
export async function addReviewToFirestore(review: {
  userName: string;
  rating: number;
  text: string;
  serviceName: string;
  source: string;
  image?: string;
}) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...review,
      date: 'Just now',
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...review, date: 'Just now' };
  } catch (err) {
    console.error('Error saving review to Firestore:', err);
    throw err;
  }
}

/**
 * Save a booking to Firestore
 */
export async function saveBookingToFirestore(booking: Booking) {
  try {
    await setDoc(doc(db, 'bookings', booking.id), {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString()
    });
    console.log('Successfully saved booking to Firestore:', booking.id);
  } catch (err) {
    console.error('Error saving booking to Firestore:', err);
    throw err;
  }
}

/**
 * Get all bookings from Firestore
 */
export async function getBookingsFromFirestore(): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsRef);
    const bookings: Booking[] = [];
    snapshot.forEach((doc) => {
      bookings.push(doc.data() as Booking);
    });
    return bookings;
  } catch (err) {
    console.error('Error getting bookings from Firestore:', err);
    return [];
  }
}
