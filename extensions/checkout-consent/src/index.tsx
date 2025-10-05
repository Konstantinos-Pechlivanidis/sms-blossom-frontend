import React from 'react';
import { render } from '@shopify/checkout-ui-extensions-react';
import CheckoutConsent from './Checkout';

render('purchase.checkout.contact.render-after' as any, () => <CheckoutConsent />);
