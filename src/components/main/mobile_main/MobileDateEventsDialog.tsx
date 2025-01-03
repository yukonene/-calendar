import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Link,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { EditEventDialog } from '../common/edit_event_dialog/EditEventDialog';
import { EventT } from '@/types/EventT';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import { useCallback, useState } from 'react';
import { useEventsContext } from '../common/EventsProvider';
import { DeleteEventDialog } from '../common/delete_event_dialog/DeleteEventDialog';
import { NewEventDialog } from '@/components/main/common/new_event_dialog/NewEventDialog';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

type Props = {
  dateEvents: EventT[];
  isOpen: boolean;
  onClose: () => void;
  date: Date;
};

export const MobileDateEventsDialog = ({
  dateEvents,
  isOpen,
  onClose,
  date,
}: Props) => {
  const [selectedDateEvent, setSelectedDateEvent] = useState<EventT>();
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const { getEvents } = useEventsContext();

  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);

  //mobileは個々にボタンを作っていない為、引数で日付を指定してあげる
  const handleEditEventClick = useCallback(
    (dateEvent: EventT) => {
      setIsEditEventDialogOpen(true);
      setSelectedDateEvent(dateEvent);
    },
    [setIsEditEventDialogOpen, setSelectedDateEvent]
  );

  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
  const handleDeleteEventClick = useCallback((dateEvent: EventT) => {
    setIsDeleteEventDialogOpen(true);
    setSelectedDateEvent(dateEvent);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="body"
      fullWidth
      maxWidth={'md'}
    >
      <Box sx={{ display: 'flex' }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ marginLeft: 'auto', padding: '0px' }}
        >
          <HighlightOffIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', padding: '4px' }}>
        <DialogTitle
          sx={{ margin: 0, padding: 2, fontWeight: 'bold' }}
          id="customized-dialog-title"
        >
          {format(new Date(date), ' M月d日')}
        </DialogTitle>
        <Button
          variant={'text'}
          onClick={() => setIsNewEventDialogOpen(true)}
          sx={{ marginLeft: 'auto', paddingTop: '4px' }}
          startIcon={<AddIcon />}
        >
          新規作成
        </Button>
      </Box>
      <NewEventDialog
        isOpen={isNewEventDialogOpen}
        onClose={() => {
          setIsNewEventDialogOpen(false);
        }}
        date={date}
        afterSaveEvent={getEvents}
      />
      {/* イベントアコーディオン */}
      {dateEvents.map((dateEvent) => {
        return (
          <Accordion
            // コンポーネントをmapで繰り返し表示する時、keyを必ず設定する
            // その時keyはユニークな値にすること　大外のboxに設定
            key={dateEvent.id}
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {/* イベントタイトル */}
              <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {dateEvent.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* イベント日時 */}
              <Box>
                <Box
                  component={'label'}
                  sx={{ fontSize: 'small', color: 'gray' }}
                >
                  開催日時
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box>
                    {format(new Date(dateEvent.startDateTime), ' M月d日H時m分')}
                  </Box>
                  <Box>
                    {!!dateEvent.endDateTime &&
                      format(new Date(dateEvent.endDateTime), '- M月d日H時m分')}
                  </Box>
                </Box>
              </Box>
              {/* 開催場所 */}
              {!!dateEvent.place && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    開催場所
                  </Box>
                  <Box>{dateEvent.place}</Box>
                </Box>
              )}
              {/* URL */}
              {!!dateEvent.url && (
                <Link
                  component={'button'}
                  onClick={() => {
                    if (!!dateEvent.url) {
                      window.open(dateEvent.url);
                    }
                  }}
                >
                  イベント詳細ページ
                </Link>
              )}
              {/* メンバー */}
              {!!dateEvent.member && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    同行メンバー
                  </Box>
                  <Box>{dateEvent.member}</Box>
                </Box>
              )}
              {/* memo */}
              {!!dateEvent.memo && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    詳細
                  </Box>
                  <Box>{dateEvent.memo}</Box>
                </Box>
              )}

              {/* 日記 */}
              {!!dateEvent.diary && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    イベントレポート
                  </Box>
                  <Box>{dateEvent.diary}</Box>
                </Box>
              )}

              {/* 成功・失敗 */}
              {dateEvent.success != null && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                    color: 'blue',
                  }}
                >
                  <Box component={'label'}>
                    {dateEvent.success != null && '脱出'}
                  </Box>
                  <Box>
                    {/* null undefined以外 */}
                    {dateEvent.success ? '成功!!' : '失敗'}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex' }}>
                <Link
                  component={'button'}
                  onClick={() => handleDeleteEventClick(dateEvent)}
                  variant={'body2'}
                  sx={{
                    marginRight: 'auto',
                    fontSize: 'small',
                    alignItems: 'center',
                  }}
                >
                  削除
                </Link>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: '100px',
                    marginTop: '16px',
                    marginLeft: 'auto',
                  }}
                  onClick={() => handleEditEventClick(dateEvent)}
                  startIcon={<ModeEditTwoToneIcon />}
                >
                  編集
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
      {!!selectedDateEvent && (
        <EditEventDialog
          event={selectedDateEvent}
          isOpen={isEditEventDialogOpen}
          onClose={() => {
            setIsEditEventDialogOpen(false);
            setSelectedDateEvent(undefined);
          }}
          afterSaveEvent={getEvents}
        />
      )}
      {!!selectedDateEvent && (
        <DeleteEventDialog
          event={selectedDateEvent}
          isOpen={isDeleteEventDialogOpen}
          onClose={() => setIsDeleteEventDialogOpen(false)}
          afterDeleteEvent={() => {
            getEvents();
            if (dateEvents.length === 1) {
              onClose();
            }
          }}
        />
      )}
    </Dialog>
  );
};
