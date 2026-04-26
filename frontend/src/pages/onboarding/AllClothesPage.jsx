import CategoryItemsPage from './CategoryItemsPage'

import Baby1 from '../../assets/Baby1.png'
import Baby2 from '../../assets/Baby2.png'
import Baby3 from '../../assets/Baby3.png'
function AllClothesPage() {
  return (
    <CategoryItemsPage
      breadcrumb={
        <>
          Recommended/<strong>All clothes</strong>
        </>
      }
      pageTitle="All Clothes"
      items={[
        {
          id: 1,
          title: 'Girl Clothes Bundle!',
          category: 'Clothes',
          donor: 'Jessica41',
          location: 'Pomona • 6 miles',
          posted: '5 days ago',
          image: Baby1,
        },
        {
          id: 2,
          title: '3T PJ sets',
          category: 'Clothes',
          donor: 'naolily',
          location: 'Chino Hills • 12 miles',
          posted: '1 week ago',
          image: Baby2,
        },
        {
          id: 3,
          title: 'Girl Clothes Bundle!',
          category: 'Clothes',
          donor: 'Jessica41',
          location: 'Pomona • 6 miles',
          posted: '5 days ago',
          image: Baby1,
        },
        {
          id: 4,
          title: '3T PJ sets',
          category: 'Clothes',
          donor: 'naolily',
          location: 'Chino Hills • 12 miles',
          posted: '1 week ago',
          image: Baby2,
        },
        {
          id: 5,
          title: 'Staawberry girl set',
          category: 'Clothes',
          donor: 'Julio121',
          location: 'San Dimas • 12 miles',
          posted: '1 week ago',
          image: Baby3,
        },
        {
          id: 6,
          title: '1T - 4T girl clothes',
          category: 'Clothes',
          donor: 'aaamber1',
          location: 'San Dimas • 13 miles',
          posted: '3 days ago',
          image: Baby1,
        },
        {
          id: 7,
          title: 'Staawberry girl set',
          category: 'Clothes',
          donor: 'Julio121',
          location: 'San Dimas • 12 miles',
          posted: '1 week ago',
          image: Baby3,
        },
        {
          id: 8,
          title: 'Staawberry girl set',
          category: 'Clothes',
          donor: 'Julio121',
          location: 'San Dimas • 12 miles',
          posted: '1 week ago',
          image: Baby3,
        },
        {
          id: 9,
          title: 'Staawberry girl set',
          category: 'Clothes',
          donor: 'Julio121',
          location: 'San Dimas • 12 miles',
          posted: '1 week ago',
          image: Baby3,
        },
      ]}
    />
  )
}

export default AllClothesPage