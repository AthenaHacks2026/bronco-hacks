import CategoryItemsPage from './CategoryItemsPage'

import Baby1 from '../../assets/Baby1.png'
import Baby2 from '../../assets/Baby2.png'
import Baby3 from '../../assets/Baby3.png'

function AllFeedingPage() {
  return (
    <CategoryItemsPage
      breadcrumb={
        <>
          Recommended/<strong>All feeding</strong>
        </>
      }
      pageTitle="All Feeding"
      items={[
        {
          id: 1,
          title: 'Bottle bundle',
          category: 'Feeding',
          donor: 'caremom1',
          location: 'Pomona • 5 miles',
          posted: '2 days ago',
          image: Baby1,
        },
        {
          id: 2,
          title: 'Feeding essentials',
          category: 'Feeding',
          donor: 'amy77',
          location: 'Montclair • 9 miles',
          posted: '6 days ago',
          image: Baby2,
        },
        {
          id: 3,
          title: 'Breast pump supplies',
          category: 'Feeding',
          donor: 'rosa12',
          location: 'Upland • 11 miles',
          posted: '1 week ago',
          image: Baby3,
        },
        {
          id: 4,
          title: 'Milk storage set',
          category: 'Feeding',
          donor: 'linda34',
          location: 'Ontario • 14 miles',
          posted: '5 days ago',
          image: Baby1,
        },
        {
          id: 5,
          title: 'Bottle bundle',
          category: 'Feeding',
          donor: 'caremom1',
          location: 'Pomona • 5 miles',
          posted: '2 days ago',
          image: Baby1,
        },
        {
          id: 6,
          title: 'Feeding essentials',
          category: 'Feeding',
          donor: 'amy77',
          location: 'Montclair • 9 miles',
          posted: '6 days ago',
          image: Baby2,
        },
      ]}
    />
  )
}

export default AllFeedingPage