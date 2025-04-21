export class ViewsController {
  async renderHome(req, res) {
    try {
      res.render('index', {
        title: 'Создать обращение',
      });
    } catch (error) {
      console.error('Error rendering home:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async renderAppeals(req, res) {
    try {
      res.render('appeals', {
        title: 'Список обращений',
      });
    } catch (error) {
      console.error('Error rendering appeals:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async renderCancelAll(req, res) {
    try {
      res.render('cancel-all', {
        title: 'Отменить все обращения',
      });
    } catch (error) {
      console.error('Error rendering cancel-all:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
