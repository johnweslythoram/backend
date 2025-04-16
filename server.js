const express = require('express');
const cors = require('cors');
const supabase = require('./supabase'); 

const app = express();
app.use(express.json());

const PORT = 3000;
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== "john") {
        return res.status(403).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
};
// 🚀 **Transactions API (Buyed Items)**
app.post('/transactions/add', authenticate, async (req, res) => {
    const { user_id, amount, category, description , type , borrowed_or_lent , name_of_person } = req.body;
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ user_id, amount, category, description ,type , borrowed_or_lent , name_of_person }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/transactions/all/:user_id', authenticate, async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
// 🚀 **Borrowed Money API**
app.post('/borrowed/add', authenticate, async (req, res) => {
    const { user_id, lender_name, amount, reason , description } = req.body;
    const { data, error } = await supabase
        .from('borrowed')
        .insert([{ user_id, lender_name, amount, reason ,description }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/borrowed/amount', authenticate, async (req, res) => {
  const {  lender_name } = req.body;

  const { data, error } = await supabase
    .from('borrowed')
    .select('amount')
    .eq('lender_name', lender_name);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

app.get('/summary/total/:userId', authenticate, async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from('total_amount_summary')
    .select('*')
    .eq('user_id', userId);;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get('/borrowed/all/:user_id', authenticate, async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('borrowed')
        .select('*')
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/borrowed/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
      .from('borrowed')
      .delete()
      .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Moved to Transactions" });
});
// 🚀 **Lent Money API**
app.post('/lent/add', authenticate, async (req, res) => {
    const { user_id, borrower_name, amount, reason ,description} = req.body;
    const { data, error } = await supabase
        .from('lent')
        .insert([{ user_id, borrower_name, amount, reason ,description}])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/lent/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
      .from('lent')
      .delete()
      .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Moved to Transactions" });
});

app.get('/lent/amount', authenticate, async (req, res) => {
  const { borrower_name} = req.body;

  const { data, error } = await supabase
    .from('lent')
    .select('amount')
    .eq('borrower_name', borrower_name)

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

app.get('/lent/all/:user_id', authenticate, async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('lent')
        .select('*')
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
// 🚀 **Planned Payments API**
app.post('/planning/add', authenticate, async (req, res) => {
    const { user_id, amount, category, description, due_date } = req.body;
    const { data, error } = await supabase
        .from('planning')
        .insert([{ user_id, amount, category, description, due_date }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/planning/delete/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('planning')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Moved to Transactions" });
});
app.get('/planning/all/:user_id', authenticate, async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('planning')
        .select('*')
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/pending/add', authenticate, async (req, res) => {
    const { user_id, amount, category, description } = req.body;
    const { data, error } = await supabase
        .from('pending')
        .insert([{ user_id, amount, category, description }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
app.post('/pending/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
      .from('pending')
      .delete()
      .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Moved to Transactions" });
});
app.get('/pending/all/:user_id', authenticate, async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('pending')
        .select('*')
        .eq('user_id', user_id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});
// 🚀 **Get All Transactions**
app.get('/transactions/all_whole/:user_id', authenticate, async (req, res) => {
    const { user_id } = req.params;
    const { data, error } = await supabase
        .from('all_transactions')
        .select('*')
        .eq('user_id', user_id)
        .order('transaction_date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/expenses/monthly/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase.rpc('get_current_month_expenses', { user_uuid: user_id });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// 🚀 **Total Expenditure for All Months**
app.get('/expenses/all/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  // Call Supabase function correctly
  const { data, error } = await supabase.rpc('get_all_time_expenses', { user_uuid: user_id });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});
// 🚀 Monthly Debit & Credit
app.get('/transactions/monthly/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase.rpc('get_monthly_debit_credit', { user_uuid: user_id });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
// 🚀 Total Debit & Credit
app.get('/transactions/total/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase.rpc('get_total_debit_credit', { user_uuid: user_id });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});
app.post('/people/add', authenticate, async (req, res) => {
  const { user_id, people_names } = req.body;
  const { data, error } = await supabase
    .from('people')
    .insert([{ user_id, people_names }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.get('/people/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('people')
    .select('people_names')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

app.get('/borrowed/total/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('borrowed_totals')
    .select('total_borrowed')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});
app.get('/lent/total/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('lent_totals')
    .select('total_lent')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});
app.get('/borrowed/monthly/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('borrowed_this_month')
    .select('total_borrowed')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});
app.get('/lent/monthly/:user_id', authenticate, async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from('lent_this_month')
    .select('total_lent')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});
app.post('/signup', async (req, res) => {
    const { email, password, username  } = req.body;

    const { user, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
    });

    if (error) return res.status(400).json({ error: "ji" });

    res.json({ user, message: "Signup successful! Please check your email to confirm your account." });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        return res.status(403).json({ error: "Please confirm your email before logging in." });
      }
      return res.status(400).json({ error: error.message });
    }
  
    const user = data.user;
    const token = data.session.access_token;
    const username = user.user_metadata?.username;
 
  
    res.json({
      message: "Login successful",
      user: {
        email: user.email,
        username: username,
        user_id : user.id
      },
      token: token
    });
  });
  
  app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5173/updatepassword' 
    });
  
    if (error) return res.status(400).json({ error: error.message });
  
    res.json({ message: 'Password reset email sent. Please check your inbox.' });
  });

  app.post('/update-password', async (req, res) => {
    const { access_token, refresh_token, newPassword } = req.body;
  
    if (!access_token || !refresh_token || !newPassword) {
      return res.status(400).json({ error: 'Access token, refresh token, and new password are required.' });
    }
  
    try {
      // Step 1: Set session
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
  
      if (sessionError) {
        return res.status(400).json({ error: 'Failed to set session: ' + sessionError.message });
      }
  
      // Step 2: Update password now that session is active
      const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  
      if (error) {
        return res.status(400).json({ error: 'Failed to update password: ' + error.message });
      }
  
      res.json({
        message: 'Password updated successfully. You can now log in with your new password.',
        user: data.user,
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error. Please try again.' });
    }
  });
  

  app.post('/check-user', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
  
    try {
        const { data, error } = await supabase
        .from('user_emails')
        .select('*')
        .eq('email', email)
        .single();
  
      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ error: error.message });
      }
  
      if (!data) {
        return res.json({ exists: false, message: 'User does not exist.' });
      }
  
      res.json({ exists: true, user: data });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.post('/resend-verification', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }
  
    try {
      // 1. Get the user from email
      const { data: users, error: listError } = await supabase.auth.admin.listUsers({ email });
  
      if (listError) {
        return res.status(500).json({ error: listError.message });
      }
  
      const user = users.users[0];
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      if (user.email_confirmed_at) {
        return res.status(400).json({ message: 'User already verified.' });
      }
  
      // 2. Send magic link to simulate verification
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://your-app.com/verified-redirect' // adjust to your frontend
        }
      });
  
      if (emailError) {
        return res.status(500).json({ error: emailError.message });
      }
  
      res.json({ message: 'Verification email sent successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Server error. Try again later.' });
    }
  });
  

  app.get('/notificationPlanning/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const { data, error } = await supabase
      .from('planning')
      .select('*')
      .eq('user_id', userId)
      .lte('due_date', new Date().toISOString().split('T')[0]);
  
      if (error) {
        return res.status(404).json({ error: error.message });
      }
  
      res.json({ data});
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  app.get('/wallet/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();
  
      if (error) {
        return res.status(404).json({ error: error.message });
      }
  
      res.json({ balance: data.balance, currency: data.currency });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  app.post('/wallet/deduct', async (req, res) => {
    const { userId, amountToDeduct } = req.body;
  
    if (!userId || !amountToDeduct) {
      return res.status(400).json({ error: 'userId and amountToDeduct are required' });
    }
  
    try {
      const { data, error } = await supabase
        .rpc('deduct_balance', {
          uid: userId,
          amount: amountToDeduct
        });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.json({ message: 'Balance updated successfully' });
    } catch (err) {
      console.error('Error deducting balance:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  

  app.post('/wallet/update', async (req, res) => {
    const { userId, amount } = req.body;
  
    if (!userId || amount === undefined) {
      return res.status(400).json({ error: 'userId and amount are required.' });
    }
  
    try {
      // Get current balance
      const { data: wallet, error: fetchError } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();
  
      if (fetchError || !wallet) {
        return res.status(404).json({ error: 'Wallet not found.' });
      }
  
      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
  
      const { error: updateError } = await supabase
        .from('user_wallets')
        .update({
          balance: newBalance,
          updated_at: new Date()
        })
        .eq('user_id', userId);
  
      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
  
      res.json({ message: 'Balance updated successfully.', newBalance });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  
// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
