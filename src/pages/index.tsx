import { EventsProvider } from '@/features/main/components/EventsProvider';
import { Main } from '@/features/main/Main';

export default function HomePage() {
  return (
    <EventsProvider>
      <Main />;
    </EventsProvider>
  );
}
