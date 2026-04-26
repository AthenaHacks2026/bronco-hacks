import CategoryItemsPage from './CategoryItemsPage'

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
          image: '/images/feed1.jpg',
        },
        {
          id: 2,
          title: 'Feeding essentials',
          category: 'Feeding',
          donor: 'amy77',
          location: 'Montclair • 9 miles',
          posted: '6 days ago',
          image: '/images/feed2.jpg',
        },
        {
          id: 3,
          title: 'Breast pump supplies',
          category: 'Feeding',
          donor: 'rosa12',
          location: 'Upland • 11 miles',
          posted: '1 week ago',
          image: '/images/feed3.jpg',
        },
        {
          id: 4,
          title: 'Milk storage set',
          category: 'Feeding',
          donor: 'linda34',
          location: 'Ontario • 14 miles',
          posted: '5 days ago',
          image: '/images/feed4.jpg',
        },
        {
          id: 5,
          title: 'Bottle bundle',
          category: 'Feeding',
          donor: 'caremom1',
          location: 'Pomona • 5 miles',
          posted: '2 days ago',
          image: '/images/feed1.jpg',
        },
        {
          id: 6,
          title: 'Feeding essentials',
          category: 'Feeding',
          donor: 'amy77',
          location: 'Montclair • 9 miles',
          posted: '6 days ago',
          image: '/images/feed2.jpg',
        },
      ]}
    />
  )
}

export default AllFeedingPage