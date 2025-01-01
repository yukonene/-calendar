import { EventsProvider } from '@/components/main/common/EventsProvider';
import { Main } from '@/components/main/Main';

export default function HomePage() {
  return (
    <EventsProvider>
      <Main />;
    </EventsProvider>
  );
}
