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
import { EditEventDialog } from '../components/edit_event_dialog/EditEventDialog';
import { EventT } from '@/types/EventT';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
import { useCallback, useState } from 'react';
import { useEventsContext } from '../components/EventsProvider';
import { DeleteEventDialog } from '../components/delete_event_dialog/DeleteEventDialog';
import { NewEventDialog } from '@/features/main/components/new_event_dialog/NewEventDialog';
import AddIcon from '@mui/icons-material/Add';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { EventPhotoT } from '@/types/EventPhotoT';

type Props = {
  dateEventInfoList: {
    event: EventT;
    eventPhotos: EventPhotoT[];
  }[];
  isOpen: boolean;
  onClose: () => void;
  date: Date;
};

export const MobileDateEventsDialog = ({
  dateEventInfoList,
  isOpen,
  onClose,
  date,
}: Props) => {
  const [selectedDateEventInfo, setSelectedDateEventInfo] = useState<{
    event: EventT;
    eventPhotos: EventPhotoT[];
  }>();
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const { getEventInfoList } = useEventsContext();

  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);

  //mobileは個々にボタンを作っていない為、引数で日付を指定してあげる
  const handleEditEventClick = useCallback(
    (dateEventInfo: { event: EventT; eventPhotos: EventPhotoT[] }) => {
      setIsEditEventDialogOpen(true);
      setSelectedDateEventInfo(dateEventInfo);
    },
    [setIsEditEventDialogOpen, setSelectedDateEventInfo]
  );

  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
  const handleDeleteEventClick = useCallback(
    (dateEventInfo: { event: EventT; eventPhotos: EventPhotoT[] }) => {
      setIsDeleteEventDialogOpen(true);
      setSelectedDateEventInfo(dateEventInfo);
    },
    []
  );

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
        afterSaveEvent={getEventInfoList}
      />
      {/* イベントアコーディオン */}
      {dateEventInfoList.map((dateEventInfo) => {
        return (
          <Accordion
            // コンポーネントをmapで繰り返し表示する時、keyを必ず設定する
            // その時keyはユニークな値にすること　大外のboxに設定
            key={dateEventInfo.event.id}
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {/* イベントタイトル */}
              <Typography
                component="span"
                sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}
              >
                {dateEventInfo.event.title}
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
                    {format(
                      new Date(dateEventInfo.event.startDateTime),
                      ' M月d日H時m分'
                    )}
                  </Box>
                  <Box>
                    {!!dateEventInfo.event.endDateTime &&
                      format(
                        new Date(dateEventInfo.event.endDateTime),
                        '- M月d日H時m分'
                      )}
                  </Box>
                </Box>
              </Box>
              {/* 開催場所 */}
              {!!dateEventInfo.event.place && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    開催場所
                  </Box>
                  <Box sx={{ wordBreak: 'break-word' }}>
                    {dateEventInfo.event.place}
                  </Box>
                </Box>
              )}
              {/* URL */}
              {!!dateEventInfo.event.url && (
                <Link
                  component={'button'}
                  type={'button'}
                  onClick={() => {
                    if (!!dateEventInfo.event.url) {
                      window.open(dateEventInfo.event.url);
                    }
                  }}
                >
                  イベント詳細ページ
                </Link>
              )}
              {/* メンバー */}
              {!!dateEventInfo.event.member && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    同行メンバー
                  </Box>
                  <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {dateEventInfo.event.member}
                  </Box>
                </Box>
              )}
              {/* memo */}
              {!!dateEventInfo.event.memo && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    詳細
                  </Box>
                  <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {dateEventInfo.event.memo}
                  </Box>
                </Box>
              )}

              {/* 日記 */}
              {!!dateEventInfo.event.diary && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box
                    component={'label'}
                    sx={{ fontSize: 'small', color: 'gray' }}
                  >
                    イベントレポート
                  </Box>
                  <Box sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {dateEventInfo.event.diary}
                  </Box>
                </Box>
              )}
              {/* イベントフォト */}
              {dateEventInfo.eventPhotos.length > 0 && (
                <img
                  src={dateEventInfo.eventPhotos[0].url}
                  alt="eventPhoto"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '250px',
                  }}
                />
              )}

              {/* 成功・失敗 */}
              {dateEventInfo.event.success != null && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '4px',
                    color: dateEventInfo.event.success ? '#0066CC' : '#FF9872',
                  }}
                >
                  <Box component={'label'}>
                    {dateEventInfo.event.success != null && '脱出'}
                  </Box>
                  <Box>
                    {/* null undefined以外 */}
                    {dateEventInfo.event.success ? '成功!!' : '失敗'}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: 'flex' }}>
                <Link
                  component={'button'}
                  type={'button'}
                  onClick={() => handleDeleteEventClick(dateEventInfo)}
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
                  onClick={() => handleEditEventClick(dateEventInfo)}
                  startIcon={<ModeEditTwoToneIcon />}
                >
                  編集
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}
      {!!selectedDateEventInfo && (
        <EditEventDialog
          eventInfo={selectedDateEventInfo}
          isOpen={isEditEventDialogOpen}
          onClose={() => {
            setIsEditEventDialogOpen(false);
            setSelectedDateEventInfo(undefined);
          }}
          afterSaveEvent={getEventInfoList}
        />
      )}
      {!!selectedDateEventInfo && (
        <DeleteEventDialog
          eventInfo={selectedDateEventInfo}
          isOpen={isDeleteEventDialogOpen}
          onClose={() => setIsDeleteEventDialogOpen(false)}
          afterDeleteEvent={() => {
            getEventInfoList();
            if (dateEventInfoList.length === 1) {
              onClose();
            }
          }}
        />
      )}
    </Dialog>
  );
};
