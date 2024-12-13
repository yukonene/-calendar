import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar } from '@fullcalendar/core/index.js';

const calendarEl = document.getElementById('calendar')!;

let calendar = new Calendar(calendarEl, {
  plugins: [interactionPlugin],
  locale: 'ja', // 日本語設定
  editable: true, // 編集可
  droppable: true, // ドロップ可
  customButtons: {
    // ヘッダーカスタムボタン
    createButton: {
      text: 'イベント登録',
      click: function () {},
      //   icon: アイコン 後で考える
    },
  },

  eventMaxStack: 5, // 最大表示イベント数（最大値を超えた部分は「+more」で表示）

  dayMaxEvents: 5, // 日表示時の最大表示イベント数（最大値を超えた部分は「+more」で表示）

  //   eventOrder: 'type, id',  // イベント表示順。初期値は早い順 https://fullcalendar.io/docs/eventOrder

  //   events: {
  //     // イベント
  //     url: `/api/schedule/`,
  //     method: 'POST',
  //     extraParams: () => {},
  //     failure: (error) => {
  //       console.log(error);
  //     },
  //   },

  //   eventTimeFormat: {
  //     // イベントの時間フォーマット　24時間表記？
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     meridiem: false,
  //   },
  //   // イベントドロップ制御
  //   eventAllow: (info, event) => {},
  //   // イベントドロップ
  //   eventDrop: (info) => {},
  //   // イベントリサイズ
  //   eventResize: (info) => {},
  //   // イベント内容
  //   eventDidMount: (info) => {},
  //   // イベントクリック
  //   eventClick: (info) => {},
  //   // カレンダー内日付・時間枠クリック
  dateClick: (info) => {
    alert('Clicked on: ' + info.dateStr);
    alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
    alert('Current view: ' + info.view.type);
    // change the day's background color just for fun
    info.dayEl.style.backgroundColor = 'red';
  },
  // +moreリンク
  //   moreLinkContent: (e) => {},
  //   // +moreリンク描画後
  //   moreLinkDidMount: (e) => {},

  //   // 初期カレンダータイプ
  //   initialView: 'dayGridMonth',
  //   // ビューごとの設定
  //   views: {
  //     dayGridMonth: {
  //       dayMaxEventRows: 5,
  //     },
  //   },
  //   // カレンダー表示領域の高さ
  //   contentHeight: 815,
  //   // 時間帯までのスクロール位置
  //   scrollTime: '06:00:00',
  //   // 週始まり
  //   firstDay: 0, // 週始まり　デフォルトは0の日曜
  //   // 日コンテンツ
  //   dayCellContent: function (e) {
  //     return e.dayNumberText.replace('日', '');
  //   },
  //   // ヘッダーボタン
  //   headerToolbar: {
  //     left: 'createButton',
  //     center: 'prev title next',
  //     right: 'timeGridWeek,timeGridDay,dayGridMonth',
  //   },
  //   // ヘッダーボタンテキスト
  //   buttonText: {
  //     week: '週',
  //     day: '日',
  //     month: '月',
  //   },
  //   // 終日テキスト
  //   allDayText: '',
  //   // スロットコンテンツ
  //   slotLabelContent: function (arg) {
  //     return arg.date.getHours();
  //   },
  //   // 日ヘッダー描画後
  //   dayHeaderDidMount: (e) => {},
  //   // 日付設定後
  //   datesSet: (dateInfo) => {},
});
